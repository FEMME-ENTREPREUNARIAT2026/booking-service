const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
// Client crée une réservation
const creerReservation = async (req, res) => {
  const { prestationId, boutiqueId, date, note } = req.body;

  if (!prestationId || !boutiqueId || !date || !heure) {
    return res.status(400).json({ message: 'prestationId, boutiqueId, date et heure sont obligatoires' });
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        clientId: req.user.userId,
        prestationId,
        boutiqueId,
        date: new Date(date),
        heure,
        note: note || null,
      }
    });
    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Client voit ses propres réservations
const mesReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { clientId: req.user.userId },
      include: { avis: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Prestataire voit les réservations de sa boutique
const reservationsBoutique = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { boutiqueId: req.params.boutiqueId },
      include: { avis: true },
      orderBy: { date: 'asc' }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Prestataire change le statut d'une réservation
const changerStatut = async (req, res) => {
  const { statut } = req.body;
  const statutsValides = ['EN_ATTENTE', 'CONFIRME', 'ANNULE', 'TERMINE'];

  if (!statutsValides.includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  try {
    const reservation = await prisma.reservation.update({
      where: { id: req.params.id },
      data: { statut }
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Client laisse un avis (seulement si réservation TERMINEE)
const laisserAvis = async (req, res) => {
  const { note, commentaire } = req.body;

  if (!note || note < 1 || note > 5) {
    return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id }
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }
    if (reservation.clientId !== req.user.userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    if (reservation.statut !== 'TERMINE') {
      return res.status(400).json({ message: 'Vous ne pouvez laisser un avis qu\'après une prestation terminée' });
    }

    const avis = await prisma.avis.create({
      data: {
        reservationId: reservation.id,
        clientId: req.user.userId,
        boutiqueId: reservation.boutiqueId,
        note,
        commentaire: commentaire || null,
      }
    });

    res.status(201).json(avis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Avis d'une boutique (public)
const avisParBoutique = async (req, res) => {
  try {
    const avis = await prisma.avis.findMany({
      where: { boutiqueId: req.params.boutiqueId },
      orderBy: { createdAt: 'desc' }
    });

    const moyenne = avis.length > 0
      ? (avis.reduce((sum, a) => sum + a.note, 0) / avis.length).toFixed(1)
      : null;

    res.json({ moyenne, total: avis.length, avis });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  creerReservation,
  mesReservations,
  reservationsBoutique,
  changerStatut,
  laisserAvis,
  avisParBoutique
};