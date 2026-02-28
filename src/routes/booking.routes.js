const express = require('express');
const router = express.Router();
const {
  creerReservation,
  mesReservations,
  reservationsBoutique,
  changerStatut,
  laisserAvis,
  avisParBoutique
} = require('../controllers/bookingController');

const { verifyToken, verifyPrestataire } = require('../middlewares/authMiddleware');

// Client
router.post('/reservations', verifyToken, creerReservation);
router.get('/reservations/mes', verifyToken, mesReservations);
router.post('/reservations/:id/avis', verifyToken, laisserAvis);

// Prestataire
router.get('/reservations/boutique/:boutiqueId', verifyPrestataire, reservationsBoutique);
router.patch('/reservations/:id/statut', verifyPrestataire, changerStatut);

// Public
router.get('/avis/boutique/:boutiqueId', avisParBoutique);

module.exports = router;