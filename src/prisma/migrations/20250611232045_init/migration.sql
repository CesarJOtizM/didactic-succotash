-- CreateTable
CREATE TABLE "payment_orders" (
    "uuid" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'payment_order',
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "country_iso_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "provider" TEXT NOT NULL DEFAULT 'stripe',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "payment_orders_pkey" PRIMARY KEY ("uuid")
);
