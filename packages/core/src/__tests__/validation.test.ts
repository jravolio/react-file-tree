import { describe, it, expect } from "vitest";

const INVALID_CHARS = /[/\\:*?"<>|]/;

function validateFilename(value: string): string | null {
  if (value.trim().length === 0) {
    return "A file or folder name must be provided.";
  }
  if (INVALID_CHARS.test(value)) {
    return 'The name must not contain / \\ : * ? " < > |';
  }
  return null;
}

describe("filename validation", () => {
  it("accepts valid filenames", () => {
    expect(validateFilename("index.ts")).toBeNull();
    expect(validateFilename("my-file.test.tsx")).toBeNull();
    expect(validateFilename(".gitignore")).toBeNull();
    expect(validateFilename("README")).toBeNull();
  });

  it("rejects empty string", () => {
    expect(validateFilename("")).toBe("A file or folder name must be provided.");
  });

  it("rejects whitespace-only", () => {
    expect(validateFilename("   ")).toBe("A file or folder name must be provided.");
  });

  it("rejects forward slash", () => {
    expect(validateFilename("file/name")).not.toBeNull();
  });

  it("rejects backslash", () => {
    expect(validateFilename("file\\name")).not.toBeNull();
  });

  it("rejects colon", () => {
    expect(validateFilename("file:name")).not.toBeNull();
  });

  it("rejects asterisk", () => {
    expect(validateFilename("file*name")).not.toBeNull();
  });

  it("rejects question mark", () => {
    expect(validateFilename("file?name")).not.toBeNull();
  });

  it("rejects double quote", () => {
    expect(validateFilename('file"name')).not.toBeNull();
  });

  it("rejects angle brackets", () => {
    expect(validateFilename("file<name>")).not.toBeNull();
  });

  it("rejects pipe", () => {
    expect(validateFilename("file|name")).not.toBeNull();
  });
});
