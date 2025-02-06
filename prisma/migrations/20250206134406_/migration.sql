-- AlterTable
ALTER TABLE "daily_health_metrics" ALTER COLUMN "date" SET DATA TYPE DATE;

-- CreateIndex
CREATE INDEX "daily_health_metrics_user_id_date_idx" ON "daily_health_metrics"("user_id", "date");

-- CreateIndex
CREATE INDEX "goals_user_id_status_idx" ON "goals"("user_id", "status");

-- CreateIndex
CREATE INDEX "goals_created_at_idx" ON "goals"("created_at");

-- CreateIndex
CREATE INDEX "groups_created_by_idx" ON "groups"("created_by");

-- CreateIndex
CREATE INDEX "groups_created_at_idx" ON "groups"("created_at");

-- CreateIndex
CREATE INDEX "physical_activities_user_id_date_idx" ON "physical_activities"("user_id", "date");

-- CreateIndex
CREATE INDEX "posts_user_id_created_at_idx" ON "posts"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "posts_group_id_created_at_idx" ON "posts"("group_id", "created_at");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");
