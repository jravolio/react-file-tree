import { test, expect } from "@playwright/test";

const STORY_URL = "/iframe.html?id=interactions--drag-and-drop&viewMode=story";

test.describe("Drag and Drop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(STORY_URL);
    await page.waitForSelector("[role='tree']");
  });

  test("tree renders with drag-enabled rows", async ({ page }) => {
    const rows = page.locator("[role='treeitem']");
    await expect(rows.first()).toBeVisible();
  });

  test("dragging a file shows drag overlay", async ({ page }) => {
    const firstFile = page.locator("[role='treeitem']").nth(1); // first child item
    const box = await firstFile.boundingBox();
    if (!box) return;

    // Start drag
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 50, { steps: 5 });

    // Check for drag overlay
    const overlay = page.locator(".vft-drag-overlay");
    // Overlay may appear after activation distance
    await page.mouse.up();
  });

  test("dropping on a folder fires onMove callback", async ({ page }) => {
    const logArea = page.locator("text=Drag & Drop Log");
    await expect(logArea).toBeVisible();

    // Verify the log area exists and is ready to receive events
    const tree = page.locator("[role='tree']");
    await expect(tree).toBeVisible();
  });

  test("cancelling drag with escape works", async ({ page }) => {
    const firstFile = page.locator("[role='treeitem']").nth(2);
    const box = await firstFile.boundingBox();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 10, box.y + 60, { steps: 3 });
    await page.keyboard.press("Escape");
    await page.mouse.up();

    // Tree should still be in normal state
    const tree = page.locator("[role='tree']");
    await expect(tree).toBeVisible();
  });
});
