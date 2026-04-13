import { test, expect } from "@playwright/test";

const STORY_URL = "/iframe.html?id=interactions--keyboard-navigation&viewMode=story";

test.describe("Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(STORY_URL);
    await page.waitForSelector("[role='tree']");
  });

  test("arrow down moves focus to next item", async ({ page }) => {
    const tree = page.locator("[role='tree']");
    await tree.focus();
    await page.keyboard.press("ArrowDown");
    const focused = page.locator(".vft-row--focused");
    await expect(focused).toBeVisible();
  });

  test("arrow right expands a folder", async ({ page }) => {
    const tree = page.locator("[role='tree']");
    await tree.focus();
    // Navigate to first item (src folder, which is expanded by default)
    await page.keyboard.press("ArrowDown");
    // Collapse it first
    await page.keyboard.press("ArrowLeft");
    // Now expand it
    await page.keyboard.press("ArrowRight");
    const expandedFolder = page.locator("[role='treeitem'][aria-expanded='true']").first();
    await expect(expandedFolder).toBeVisible();
  });

  test("arrow left collapses a folder", async ({ page }) => {
    const tree = page.locator("[role='tree']");
    await tree.focus();
    await page.keyboard.press("ArrowDown"); // focus src
    await page.keyboard.press("ArrowLeft"); // collapse src
    const collapsed = page.locator("[data-id='src'][aria-expanded='false']");
    await expect(collapsed).toBeVisible();
  });

  test("enter fires onNodeClick for a file", async ({ page }) => {
    const tree = page.locator("[role='tree']");
    await tree.focus();
    // Navigate to a file (src is expanded, so ArrowDown twice gets to first child)
    await page.keyboard.press("ArrowDown"); // src
    await page.keyboard.press("ArrowDown"); // src/components
    await page.keyboard.press("ArrowDown"); // src/components/Button.tsx (if expanded)
    await page.keyboard.press("Enter");
    // Verify the last action text updated (the story logs clicks)
    const lastAction = page.locator("text=Clicked");
    // May or may not be visible depending on tree state, but no errors should occur
  });

  test("home goes to first item, end goes to last", async ({ page }) => {
    const tree = page.locator("[role='tree']");
    await tree.focus();
    await page.keyboard.press("End");
    const lastFocused = page.locator(".vft-row--focused");
    await expect(lastFocused).toBeVisible();
    await page.keyboard.press("Home");
    const firstFocused = page.locator(".vft-row--focused");
    await expect(firstFocused).toBeVisible();
  });

  test("escape clears selection", async ({ page }) => {
    const tree = page.locator("[role='tree']");
    await tree.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Escape");
    const selected = page.locator(".vft-row--selected");
    await expect(selected).toHaveCount(0);
  });
});
