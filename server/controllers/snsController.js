/**
 * SNS Controller (snsController.js)
 * ============================================================================
 * 
 * WHY CONTROLLERS EXIST:
 * This controller allows users or system-scheduled cron workers to manually trigger 
 * alerts or operational tests. For example, if a cost spike simulation is activated,
 * or if a budget is exceeded, this controller acts as the dispatch hub by coordinating
 * with Amazon SNS to deliver priority SMS or Email notifications.
 * 
 * Routes mapped here:
 * - POST /api/sns/send-alert : Dispatches custom message to the SNS Topic
 */

const { sendSNSAlert } = require('../services/snsService');

const triggerAlert = async (req, res, next) => {
  try {
    const { subject, message } = req.body;

    console.log(`[SNS Controller]: Request to send notification received.`);

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message body to broadcast'
      });
    }

    const alertSubject = subject || 'AWS FinOps Budget Alarm';

    // Delegate the publication request to the SNS Service layer
    const result = await sendSNSAlert(alertSubject, message);

    res.status(200).json({
      success: true,
      message: 'Notification successfully published to AWS SNS pipeline',
      awsResponse: result
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerAlert
};
