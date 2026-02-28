-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('EN_ATTENTE', 'CONFIRME', 'ANNULE', 'TERMINE');

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "prestationId" TEXT NOT NULL,
    "boutiqueId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "statut" "Statut" NOT NULL DEFAULT 'EN_ATTENTE',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "boutiqueId" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avis_reservationId_key" ON "Avis"("reservationId");

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
