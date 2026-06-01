-- AddUniqueConstraint
-- Enforces uniqueness on ExpenseCategory.name so the seed upsert is safe
-- and duplicate categories cannot be created by the application.
CREATE UNIQUE INDEX "ExpenseCategory_name_key" ON "ExpenseCategory"("name");
ALTER TABLE "ExpenseCategory" ADD CONSTRAINT "ExpenseCategory_name_key" UNIQUE USING INDEX "ExpenseCategory_name_key";
