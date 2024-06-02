/*
  Warnings:

  - You are about to drop the `registrations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `slots_available` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `organization_details` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusEvent" AS ENUM ('open_registration', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "StatusPayment" AS ENUM ('pending', 'approved', 'cancelled');

-- CreateEnum
CREATE TYPE "StatusActivity" AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_event_id_fkey";

-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_volunteer_id_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "additional_info" TEXT,
ADD COLUMN     "slots_available" INTEGER NOT NULL,
ADD COLUMN     "status" "StatusEvent" NOT NULL;

-- AlterTable
ALTER TABLE "organization_details" ADD COLUMN     "description" TEXT NOT NULL;

-- DropTable
DROP TABLE "registrations";

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "volunteer_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "status" "StatusActivity" NOT NULL,
    "statusPayment" "StatusPayment" NOT NULL,
    "motivation" TEXT NOT NULL,
    "additional_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
