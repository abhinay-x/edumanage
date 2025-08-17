const admin = require('firebase-admin');
const { sendEmail } = require('../utils/emailService');

const db = admin.firestore();

// Send message between users
const sendMessage = async (messageData, senderUid) => {
  try {
    const { recipientId, subject, content, type, attachments } = messageData;

    // Validate recipient exists
    const recipientDoc = await db.collection('users').doc(recipientId).get();
    if (!recipientDoc.exists) {
      throw new Error('Recipient not found');
    }

    const messageDoc = {
      senderId: senderUid,
      recipientId,
      subject: subject || '',
      content,
      type: type || 'personal', // personal, announcement, system
      attachments: attachments || [],
      isRead: false,
      readAt: null,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('messages').add(messageDoc);

    // Create notification for recipient
    await db.collection('notifications').add({
      title: 'New Message',
      message: `You have a new message: ${subject || content.substring(0, 50)}...`,
      recipients: [recipientId],
      type: 'message',
      senderId: senderUid,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      isRead: false,
      messageId: docRef.id
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Send bulk message to multiple recipients
const sendBulkMessage = async (messageData, senderUid) => {
  try {
    const { recipientIds, subject, content, type, attachments } = messageData;
    const results = [];

    for (const recipientId of recipientIds) {
      try {
        const result = await sendMessage({
          recipientId,
          subject,
          content,
          type,
          attachments
        }, senderUid);
        results.push({ recipientId, success: true, messageId: result.id });
      } catch (error) {
        results.push({ recipientId, success: false, error: error.message });
      }
    }

    return { results, totalSent: results.filter(r => r.success).length };
  } catch (error) {
    console.error('Error sending bulk message:', error);
    throw error;
  }
};

// Mark message as read
const markMessageAsRead = async (messageId, userId) => {
  try {
    const messageDoc = await db.collection('messages').doc(messageId).get();
    if (!messageDoc.exists) {
      throw new Error('Message not found');
    }

    const message = messageDoc.data();
    if (message.recipientId !== userId) {
      throw new Error('Unauthorized to mark this message as read');
    }

    await db.collection('messages').doc(messageId).update({
      isRead: true,
      readAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// Get user messages (inbox)
const getUserMessages = async (userId, type = 'all', limit = 50) => {
  try {
    let query = db.collection('messages')
      .where('recipientId', '==', userId);

    if (type !== 'all') {
      query = query.where('type', '==', type);
    }

    const messagesSnapshot = await query
      .orderBy('sentAt', 'desc')
      .limit(limit)
      .get();

    const messages = [];
    for (const doc of messagesSnapshot.docs) {
      const messageData = doc.data();
      
      // Get sender information
      const senderDoc = await db.collection('users').doc(messageData.senderId).get();
      const sender = senderDoc.exists ? senderDoc.data() : null;

      messages.push({
        id: doc.id,
        ...messageData,
        senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown',
        senderEmail: sender ? sender.email : 'unknown@example.com'
      });
    }

    return messages;
  } catch (error) {
    console.error('Error getting user messages:', error);
    throw error;
  }
};

// Get sent messages
const getSentMessages = async (userId, limit = 50) => {
  try {
    const messagesSnapshot = await db.collection('messages')
      .where('senderId', '==', userId)
      .orderBy('sentAt', 'desc')
      .limit(limit)
      .get();

    const messages = [];
    for (const doc of messagesSnapshot.docs) {
      const messageData = doc.data();
      
      // Get recipient information
      const recipientDoc = await db.collection('users').doc(messageData.recipientId).get();
      const recipient = recipientDoc.exists ? recipientDoc.data() : null;

      messages.push({
        id: doc.id,
        ...messageData,
        recipientName: recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Unknown',
        recipientEmail: recipient ? recipient.email : 'unknown@example.com'
      });
    }

    return messages;
  } catch (error) {
    console.error('Error getting sent messages:', error);
    throw error;
  }
};

// Create announcement for class or school
const createAnnouncement = async (announcementData, creatorUid) => {
  try {
    const { title, content, targetAudience, classIds, priority, expiryDate } = announcementData;

    const announcementDoc = {
      title,
      content,
      targetAudience, // all, teachers, students, class_specific
      classIds: classIds || [],
      priority: priority || 'normal', // low, normal, high, urgent
      expiryDate: expiryDate || null,
      createdBy: creatorUid,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('announcements').add(announcementDoc);

    // Send notifications to target audience
    await notifyTargetAudience(announcementDoc, docRef.id);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Helper function to notify target audience
const notifyTargetAudience = async (announcement, announcementId) => {
  try {
    let recipientIds = [];

    if (announcement.targetAudience === 'all') {
      // Get all active users
      const usersSnapshot = await db.collection('users')
        .where('isActive', '==', true)
        .get();
      recipientIds = usersSnapshot.docs.map(doc => doc.id);
    } else if (announcement.targetAudience === 'teachers') {
      // Get all teachers
      const teachersSnapshot = await db.collection('users')
        .where('role', '==', 'teacher')
        .where('isActive', '==', true)
        .get();
      recipientIds = teachersSnapshot.docs.map(doc => doc.id);
    } else if (announcement.targetAudience === 'students') {
      // Get all students
      const studentsSnapshot = await db.collection('users')
        .where('role', '==', 'student')
        .where('isActive', '==', true)
        .get();
      recipientIds = studentsSnapshot.docs.map(doc => doc.id);
    } else if (announcement.targetAudience === 'class_specific') {
      // Get students from specific classes
      for (const classId of announcement.classIds) {
        const enrollmentsSnapshot = await db.collection('enrollments')
          .where('classId', '==', classId)
          .where('status', '==', 'active')
          .get();
        
        const classStudentIds = enrollmentsSnapshot.docs.map(doc => doc.data().studentId);
        recipientIds = [...recipientIds, ...classStudentIds];
      }
      
      // Remove duplicates
      recipientIds = [...new Set(recipientIds)];
    }

    if (recipientIds.length > 0) {
      await db.collection('notifications').add({
        title: announcement.title,
        message: announcement.content.substring(0, 100) + '...',
        recipients: recipientIds,
        type: 'announcement',
        senderId: announcement.createdBy,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false,
        announcementId,
        priority: announcement.priority
      });
    }
  } catch (error) {
    console.error('Error notifying target audience:', error);
  }
};

// Get announcements for user
const getUserAnnouncements = async (userId, limit = 20) => {
  try {
    // Get user role and classes
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const user = userDoc.data();
    let classIds = [];

    if (user.role === 'student') {
      // Get enrolled classes
      const enrollmentsSnapshot = await db.collection('enrollments')
        .where('studentId', '==', userId)
        .where('status', '==', 'active')
        .get();
      classIds = enrollmentsSnapshot.docs.map(doc => doc.data().classId);
    } else if (user.role === 'teacher') {
      // Get teaching classes
      const classesSnapshot = await db.collection('classes')
        .where('teacherId', '==', userId)
        .get();
      classIds = classesSnapshot.docs.map(doc => doc.id);
    }

    // Get relevant announcements
    const now = new Date();
    const announcementsSnapshot = await db.collection('announcements')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(limit * 2) // Get more to filter
      .get();

    const relevantAnnouncements = [];

    announcementsSnapshot.docs.forEach(doc => {
      const announcement = doc.data();
      
      // Check if announcement is expired
      if (announcement.expiryDate && new Date(announcement.expiryDate) < now) {
        return;
      }

      // Check if user should see this announcement
      if (announcement.targetAudience === 'all' ||
          announcement.targetAudience === user.role + 's' ||
          (announcement.targetAudience === 'class_specific' && 
           announcement.classIds.some(classId => classIds.includes(classId)))) {
        
        relevantAnnouncements.push({
          id: doc.id,
          ...announcement
        });
      }
    });

    return relevantAnnouncements.slice(0, limit);
  } catch (error) {
    console.error('Error getting user announcements:', error);
    throw error;
  }
};

// Delete message
const deleteMessage = async (messageId, userId) => {
  try {
    const messageDoc = await db.collection('messages').doc(messageId).get();
    if (!messageDoc.exists) {
      throw new Error('Message not found');
    }

    const message = messageDoc.data();
    if (message.recipientId !== userId && message.senderId !== userId) {
      throw new Error('Unauthorized to delete this message');
    }

    await db.collection('messages').doc(messageId).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// Get message statistics
const getMessageStatistics = async (userId) => {
  try {
    // Get unread messages count
    const unreadSnapshot = await db.collection('messages')
      .where('recipientId', '==', userId)
      .where('isRead', '==', false)
      .get();

    // Get total received messages
    const totalReceivedSnapshot = await db.collection('messages')
      .where('recipientId', '==', userId)
      .get();

    // Get total sent messages
    const totalSentSnapshot = await db.collection('messages')
      .where('senderId', '==', userId)
      .get();

    return {
      unreadCount: unreadSnapshot.size,
      totalReceived: totalReceivedSnapshot.size,
      totalSent: totalSentSnapshot.size
    };
  } catch (error) {
    console.error('Error getting message statistics:', error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  sendBulkMessage,
  markMessageAsRead,
  getUserMessages,
  getSentMessages,
  createAnnouncement,
  getUserAnnouncements,
  deleteMessage,
  getMessageStatistics
};
