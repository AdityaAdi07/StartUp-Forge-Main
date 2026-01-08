const express = require('express');
const pool = require('./db');

const router = express.Router();

/**
 * Get Inbox (Accepted Connections)
 * Returns all connections where status = 'ACCEPTED' and user is a participant.
 * Headers: x-user-id, x-user-role (for simulation)
 */
router.get('/', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(400).json({ error: 'Missing x-user-id header' });
  }

  try {
    const uid = parseInt(userId);
    if (isNaN(uid)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const result = await pool.query(`
      WITH user_connections AS (
        SELECT 
          c.id as connection_id,
          CASE 
            WHEN c.user_a_id = $1 THEN c.user_b_id
            ELSE c.user_a_id
          END as other_user_id,
          CASE 
            WHEN c.user_a_id = $1 THEN c.user_b_role
            ELSE c.user_a_role
          END as other_user_role
        FROM connections c
        JOIN connection_requests cr ON c.connection_request_id = cr.id
        WHERE cr.status = 'ACCEPTED'
        AND (c.user_a_id = $1 OR c.user_b_id = $1)
      )
      SELECT 
        uc.*,
        COALESCE(f.name, i.name, 'Unknown User') as other_user_name,
        COALESCE(f.company, i.firm_name, NULL) as other_user_headline,
        CASE 
             WHEN f.id IS NOT NULL THEN 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
             ELSE 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
        END as other_user_avatar
      FROM user_connections uc
      LEFT JOIN founders f ON uc.other_user_role = 'FOUNDER' AND f.id = uc.other_user_id
      LEFT JOIN investors i ON uc.other_user_role = 'INVESTOR' AND i.id = uc.other_user_id
    `, [uid]);

    res.json({ connections: result.rows });
  } catch (err) {
    console.error('Error fetching inbox:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
