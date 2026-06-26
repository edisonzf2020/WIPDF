/**
 * Minimal self-check for invoiceGenerator logic.
 * Run: npx tsx scripts/check-generator.ts
 */
import assert from "node:assert/strict";

import { generateRandomInvoice } from "../src/utils/invoiceGenerator";
import { InvoiceType } from "../src/types/invoice";

// Case 1: No options — all random, should still produce valid data.
const inv1 = generateRandomInvoice("test@example.com", InvoiceType.WINDSURF);
assert.ok(inv1.billTo.name.length > 0, "random name should be non-empty");
assert.equal(
	inv1.billTo.email,
	"test@example.com",
	"email should pass through",
);
assert.ok(
	inv1.paymentMethod.length > 0,
	"random payment method should be non-empty",
);
assert.equal(
	inv1.billTo.zipCode,
	undefined,
	"zipCode should be undefined when not provided",
);

// Case 2: With name/address/zipCode overrides.
const inv2 = generateRandomInvoice("user@test.com", InvoiceType.CURSOR, {
	name: "ALICE WONDERLAND",
	address: "42 Rabbit Hole Lane",
	zipCode: "12345",
});
assert.equal(
	inv2.billTo.name,
	"ALICE WONDERLAND",
	"name should match user input",
);
assert.equal(
	inv2.billTo.address1,
	"42 Rabbit Hole Lane",
	"address1 should match user input",
);
assert.equal(
	inv2.billTo.address2,
	"",
	"address2 should be empty for single-part custom address",
);
assert.equal(
	inv2.billTo.city,
	"",
	"city should be empty for single-part custom address",
);
assert.equal(
	inv2.billTo.state,
	"",
	"state should be empty for single-part custom address",
);
assert.equal(
	inv2.billTo.country,
	"",
	"country should be empty for single-part custom address",
);
assert.equal(inv2.billTo.zipCode, "12345", "zipCode should match user input");

// Case 3: Payment method — specific card type appends random last 4.
const inv3 = generateRandomInvoice("pm@test.com", InvoiceType.WINDSURF, {
	paymentMethod: "Visa",
});
assert.ok(
	inv3.paymentMethod.startsWith("Visa - "),
	`expected "Visa - XXXX", got "${inv3.paymentMethod}"`,
);
assert.equal(
	inv3.paymentMethod.length,
	11,
	`expected 11 chars for "Visa - XXXX", got ${inv3.paymentMethod.length}`,
);

// Case 4: Payment method — custom value used as-is, no appended digits.
const inv4 = generateRandomInvoice("custom@test.com", InvoiceType.WINDSURF, {
	paymentMethod: "PayPal",
});
assert.equal(
	inv4.paymentMethod,
	"PayPal",
	`custom payment should be "PayPal", got "${inv4.paymentMethod}"`,
);

// Case 5: Payment method — empty string means random.
const inv5 = generateRandomInvoice("empty@test.com", InvoiceType.WINDSURF, {
	paymentMethod: "",
});
assert.ok(
	inv5.paymentMethod.includes(" - "),
	'random payment should have " - " separator',
);

// Case 6: Custom address parsing — 4-part comma-separated (user's reported bug).
const inv6 = generateRandomInvoice("addr@test.com", InvoiceType.WINDSURF, {
	name: "FAN ZHANG",
	address: "11 soundview DR, great neck, NY, United States",
	zipCode: "11020",
});
assert.equal(
	inv6.billTo.address1,
	"11 soundview DR",
	"address1 should be street",
);
assert.equal(
	inv6.billTo.address2,
	"",
	"address2 should be empty for parsed address",
);
assert.equal(
	inv6.billTo.city,
	"great neck",
	"city should be parsed from address",
);
assert.equal(inv6.billTo.state, "NY", "state should be parsed from address");
assert.equal(
	inv6.billTo.country,
	"United States",
	"country should be parsed from address",
);
assert.equal(inv6.billTo.zipCode, "11020", "zipCode should match input");

// Case 7: Custom address — 3-part (no state).
const inv7 = generateRandomInvoice("addr2@test.com", InvoiceType.CURSOR, {
	address: "456 Oak Ave, Toronto, Canada",
});
assert.equal(inv7.billTo.address1, "456 Oak Ave");
assert.equal(inv7.billTo.city, "Toronto");
assert.equal(inv7.billTo.state, "");
assert.equal(inv7.billTo.country, "Canada");

// Case 8: Custom address — 2-part (street + country).
const inv8 = generateRandomInvoice("addr3@test.com", InvoiceType.WINDSURF, {
	address: "123 Main Street, United States",
});
assert.equal(inv8.billTo.address1, "123 Main Street");
assert.equal(inv8.billTo.address2, "");
assert.equal(inv8.billTo.city, "");
assert.equal(inv8.billTo.state, "");
assert.equal(inv8.billTo.country, "United States");

// Case 9: Custom address — 5+ parts, first parts merge into address1.
const inv9 = generateRandomInvoice("addr4@test.com", InvoiceType.WINDSURF, {
	address: "Apt 3B, 100 Broadway, Manhattan, NY, United States",
});
assert.equal(inv9.billTo.address1, "Apt 3B, 100 Broadway");
assert.equal(inv9.billTo.address2, "");
assert.equal(inv9.billTo.city, "Manhattan");
assert.equal(inv9.billTo.state, "NY");
assert.equal(inv9.billTo.country, "United States");

// Case 10: Custom datePaid passes through to invoice.
const inv10 = generateRandomInvoice("date@test.com", InvoiceType.WINDSURF, {
	datePaid: "June 1, 2026",
});
assert.equal(
	inv10.datePaid,
	"June 1, 2026",
	"custom datePaid should pass through",
);
assert.ok(
	inv10.dateRange.includes("Jun 1"),
	`dateRange should be based on custom datePaid, got "${inv10.dateRange}"`,
);

// Case 11: Random datePaid falls within [today - 60d, today - 15d].
// Run 20 times to reduce flakiness.
const now = new Date();
const earliest = new Date(now);
earliest.setDate(now.getDate() - 60);
earliest.setHours(0, 0, 0, 0);
const latest = new Date(now);
latest.setDate(now.getDate() - 15);
latest.setHours(23, 59, 59, 999);
for (let i = 0; i < 20; i++) {
	const inv = generateRandomInvoice(`rand${i}@test.com`, InvoiceType.WINDSURF);
	const parsed = new Date(inv.datePaid);
	assert.ok(
		!isNaN(parsed.getTime()),
		`datePaid should be parseable, got "${inv.datePaid}"`,
	);
	assert.ok(
		parsed >= earliest && parsed <= latest,
		`random datePaid should be in [today-60d, today-15d], got "${inv.datePaid}" (parsed: ${parsed.toISOString()})`,
	);
}

// Case 12: Phone — provided, should pass through.
const inv12 = generateRandomInvoice("phone@test.com", InvoiceType.WINDSURF, {
	phone: "+1-516-555-0199",
});
assert.equal(
	inv12.billTo.phone,
	"+1-516-555-0199",
	"phone should pass through when provided",
);

// Case 13: Phone — not provided, should be undefined.
const inv13 = generateRandomInvoice("nophone@test.com", InvoiceType.WINDSURF);
assert.equal(
	inv13.billTo.phone,
	undefined,
	"phone should be undefined when not provided",
);
console.log("All checks passed.");
