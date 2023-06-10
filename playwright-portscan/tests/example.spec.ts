import { test, expect } from "@playwright/test";

test("Start port scan", async ({ page }) => {
  await page.goto(
    "http://localhost:3000/?begin_port=3000&end_port=3005&n_scans=1&n_sockets=100&socket_timeout=400&scanning_technique=fetch"
  );
  await page.getByRole("button").getAttribute("#startPortScanner");
  const locator = page.locator("#finished");
  await expect(locator).toBeVisible({ timeout: 60000 });
});
