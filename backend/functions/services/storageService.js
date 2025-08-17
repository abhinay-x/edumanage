const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const storage = admin.storage();
const db = admin.firestore();

// Upload file to Firebase Storage
const uploadFile = async (fileBuffer, fileName, folder, metadata = {}) => {
  try {
    const bucket = storage.bucket();
    const fileId = uuidv4();
    const fileExtension = fileName.split('.').pop();
    const storagePath = `${folder}/${fileId}.${fileExtension}`;
    
    const file = bucket.file(storagePath);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: metadata.contentType || 'application/octet-stream',
        metadata: {
          originalName: fileName,
          uploadedBy: metadata.uploadedBy || 'system',
          uploadedAt: new Date().toISOString(),
          ...metadata.customMetadata
        }
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Upload error:', error);
        reject(error);
      });

      stream.on('finish', async () => {
        try {
          // Make file publicly accessible if needed
          if (metadata.makePublic) {
            await file.makePublic();
          }

          // Get download URL
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500' // Far future date
          });

          const fileRecord = {
            id: fileId,
            originalName: fileName,
            storagePath,
            downloadUrl: url,
            size: fileBuffer.length,
            contentType: metadata.contentType,
            folder,
            uploadedBy: metadata.uploadedBy,
            uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
            isPublic: metadata.makePublic || false
          };

          // Save file record to Firestore
          await db.collection('files').doc(fileId).set(fileRecord);

          resolve({
            success: true,
            fileId,
            downloadUrl: url,
            storagePath,
            size: fileBuffer.length
          });
        } catch (error) {
          reject(error);
        }
      });

      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Delete file from Firebase Storage
const deleteFile = async (fileId, deletedBy) => {
  try {
    // Get file record
    const fileDoc = await db.collection('files').doc(fileId).get();
    if (!fileDoc.exists) {
      throw new Error('File not found');
    }

    const fileData = fileDoc.data();
    const bucket = storage.bucket();
    const file = bucket.file(fileData.storagePath);

    // Delete from storage
    await file.delete();

    // Update file record (soft delete)
    await db.collection('files').doc(fileId).update({
      isDeleted: true,
      deletedBy,
      deletedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get file metadata
const getFileMetadata = async (fileId) => {
  try {
    const fileDoc = await db.collection('files').doc(fileId).get();
    if (!fileDoc.exists) {
      throw new Error('File not found');
    }

    return fileDoc.data();
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
};

// Upload profile picture
const uploadProfilePicture = async (fileBuffer, fileName, userId) => {
  try {
    const result = await uploadFile(fileBuffer, fileName, 'profile-pictures', {
      contentType: 'image/jpeg',
      uploadedBy: userId,
      makePublic: true,
      customMetadata: {
        type: 'profile_picture',
        userId
      }
    });

    // Update user profile with new picture URL
    await db.collection('users').doc(userId).update({
      profilePicture: result.downloadUrl,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return result;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Upload assignment attachment
const uploadAssignmentAttachment = async (fileBuffer, fileName, assignmentId, uploadedBy) => {
  try {
    const result = await uploadFile(fileBuffer, fileName, 'assignments', {
      contentType: getContentType(fileName),
      uploadedBy,
      customMetadata: {
        type: 'assignment_attachment',
        assignmentId
      }
    });

    // Add attachment to assignment
    const assignmentRef = db.collection('assignments').doc(assignmentId);
    await assignmentRef.update({
      attachments: admin.firestore.FieldValue.arrayUnion({
        fileId: result.fileId,
        fileName,
        downloadUrl: result.downloadUrl,
        size: result.size,
        uploadedAt: new Date().toISOString()
      })
    });

    return result;
  } catch (error) {
    console.error('Error uploading assignment attachment:', error);
    throw error;
  }
};

// Upload submission file
const uploadSubmissionFile = async (fileBuffer, fileName, submissionId, studentId) => {
  try {
    const result = await uploadFile(fileBuffer, fileName, 'submissions', {
      contentType: getContentType(fileName),
      uploadedBy: studentId,
      customMetadata: {
        type: 'submission_file',
        submissionId,
        studentId
      }
    });

    // Add file to submission
    const submissionRef = db.collection('submissions').doc(submissionId);
    await submissionRef.update({
      attachments: admin.firestore.FieldValue.arrayUnion({
        fileId: result.fileId,
        fileName,
        downloadUrl: result.downloadUrl,
        size: result.size,
        uploadedAt: new Date().toISOString()
      })
    });

    return result;
  } catch (error) {
    console.error('Error uploading submission file:', error);
    throw error;
  }
};

// Upload resource file
const uploadResourceFile = async (fileBuffer, fileName, resourceData, uploadedBy) => {
  try {
    const result = await uploadFile(fileBuffer, fileName, 'resources', {
      contentType: getContentType(fileName),
      uploadedBy,
      customMetadata: {
        type: 'resource_file',
        category: resourceData.category,
        subjectId: resourceData.subjectId
      }
    });

    // Create resource record
    const resourceDoc = {
      title: resourceData.title,
      description: resourceData.description || '',
      category: resourceData.category, // document, video, audio, image, other
      subjectId: resourceData.subjectId,
      classIds: resourceData.classIds || [],
      fileId: result.fileId,
      fileName,
      downloadUrl: result.downloadUrl,
      size: result.size,
      isPublic: resourceData.isPublic || false,
      uploadedBy,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('resources').add(resourceDoc);
    return { ...result, resourceId: docRef.id };
  } catch (error) {
    console.error('Error uploading resource file:', error);
    throw error;
  }
};

// Get user files
const getUserFiles = async (userId, folder = null, limit = 50) => {
  try {
    let query = db.collection('files')
      .where('uploadedBy', '==', userId)
      .where('isDeleted', '!=', true);

    if (folder) {
      query = query.where('folder', '==', folder);
    }

    const filesSnapshot = await query
      .orderBy('uploadedAt', 'desc')
      .limit(limit)
      .get();

    return filesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user files:', error);
    throw error;
  }
};

// Get storage usage statistics
const getStorageUsage = async (userId = null) => {
  try {
    let query = db.collection('files').where('isDeleted', '!=', true);
    
    if (userId) {
      query = query.where('uploadedBy', '==', userId);
    }

    const filesSnapshot = await query.get();
    
    let totalSize = 0;
    const folderStats = {};

    filesSnapshot.docs.forEach(doc => {
      const file = doc.data();
      totalSize += file.size || 0;
      
      if (!folderStats[file.folder]) {
        folderStats[file.folder] = {
          count: 0,
          size: 0
        };
      }
      
      folderStats[file.folder].count++;
      folderStats[file.folder].size += file.size || 0;
    });

    return {
      totalFiles: filesSnapshot.size,
      totalSize,
      totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
      folderStats
    };
  } catch (error) {
    console.error('Error getting storage usage:', error);
    throw error;
  }
};

// Clean up old files (for scheduled cleanup)
const cleanupOldFiles = async (daysOld = 365) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const oldFilesSnapshot = await db.collection('files')
      .where('isDeleted', '==', true)
      .where('deletedAt', '<', cutoffDate)
      .get();

    const bucket = storage.bucket();
    let deletedCount = 0;

    for (const doc of oldFilesSnapshot.docs) {
      try {
        const fileData = doc.data();
        const file = bucket.file(fileData.storagePath);
        
        // Delete from storage
        await file.delete();
        
        // Delete record from Firestore
        await doc.ref.delete();
        
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting file ${doc.id}:`, error);
      }
    }

    return { deletedCount };
  } catch (error) {
    console.error('Error cleaning up old files:', error);
    throw error;
  }
};

// Helper function to determine content type
const getContentType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  const contentTypes = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'rtf': 'application/rtf',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    
    // Video
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv'
  };

  return contentTypes[extension] || 'application/octet-stream';
};

module.exports = {
  uploadFile,
  deleteFile,
  getFileMetadata,
  uploadProfilePicture,
  uploadAssignmentAttachment,
  uploadSubmissionFile,
  uploadResourceFile,
  getUserFiles,
  getStorageUsage,
  cleanupOldFiles
};
