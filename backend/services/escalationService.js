const cron = require('node-cron');
const Complaint = require('../models/Complaint');

/**
 * Escalation Service
 *
 * Runs a scheduled job every hour to check for unresolved complaints
 * that are older than 48 hours. Any matching complaint is automatically
 * marked as "Escalated" with isEscalated = true.
 *
 * This ensures no complaint sits unattended for too long without
 * administrative visibility.
 */

const ESCALATION_THRESHOLD_HOURS = 48;

/**
 * Core escalation logic — can also be called manually for testing.
 * Finds all Pending or In Progress complaints older than the threshold
 * and bulk-updates them to Escalated status.
 */
const runEscalationCheck = async () => {
  try {
    const thresholdDate = new Date(
      Date.now() - ESCALATION_THRESHOLD_HOURS * 60 * 60 * 1000
    );

    const result = await Complaint.updateMany(
      {
        status: { $in: ['Pending', 'In Progress'] },
        isEscalated: false,
        createdAt: { $lte: thresholdDate },
      },
      {
        $set: {
          status: 'Escalated',
          isEscalated: true,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `⚠️  Escalation: ${result.modifiedCount} complaint(s) escalated`
      );
    }
  } catch (error) {
    console.error('❌ Escalation job error:', error.message);
  }
};

/**
 * Starts the cron job. Runs every hour at minute 0.
 * Cron expression: '0 * * * *' = at the start of every hour.
 */
const startEscalationJob = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🕐 Running escalation check...');
    await runEscalationCheck();
  });

  console.log('📅 Escalation cron job scheduled (runs every hour)');
};

module.exports = { startEscalationJob, runEscalationCheck };
