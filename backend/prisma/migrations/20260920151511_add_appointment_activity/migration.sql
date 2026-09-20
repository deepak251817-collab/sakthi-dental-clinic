-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('REQUEST_CREATED', 'STATUS_CHANGED', 'APPOINTMENT_DELETED');

-- CreateTable
CREATE TABLE "appointment_activities" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "admin_id" TEXT,
    "actor_name" TEXT,
    "action" "ActivityAction" NOT NULL,
    "previous_status" "AppointmentStatus",
    "new_status" "AppointmentStatus",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointment_activities_appointment_id_idx" ON "appointment_activities"("appointment_id");

-- CreateIndex
CREATE INDEX "appointment_activities_created_at_idx" ON "appointment_activities"("created_at");

-- AddForeignKey
ALTER TABLE "appointment_activities" ADD CONSTRAINT "appointment_activities_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_activities" ADD CONSTRAINT "appointment_activities_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
