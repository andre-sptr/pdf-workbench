import { describe, expect, it } from 'vitest';
import { getToolsByCategory, toolCategories, tools, type ToolCategory } from '@/lib/tools-config';

describe('tools-config', () => {
  it('defines all 5 expected tool categories in order', () => {
    expect(toolCategories).toHaveLength(5);
    expect(toolCategories.map((c) => c.id)).toEqual([
      'edit',
      'convert-to',
      'convert-from',
      'security',
      'ocr',
    ]);
    for (const category of toolCategories) {
      expect(category.title.trim().length).toBeGreaterThan(0);
      expect(category.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('defines 18 unique tools with valid metadata and categories', () => {
    expect(tools).toHaveLength(18);

    const categoryIds = new Set<ToolCategory>(toolCategories.map((c) => c.id));
    const slugs = new Set<string>();

    for (const tool of tools) {
      expect(tool.slug.trim().length).toBeGreaterThan(0);
      expect(tool.title.trim().length).toBeGreaterThan(0);
      expect(tool.description.trim().length).toBeGreaterThan(0);
      expect(tool.icon).toBeDefined();
      expect(categoryIds.has(tool.category)).toBe(true);
      expect(slugs.has(tool.slug)).toBe(false);
      slugs.add(tool.slug);
    }
  });

  it('returns the expected number of tools per category via getToolsByCategory', () => {
    expect(getToolsByCategory('edit')).toHaveLength(5);
    expect(getToolsByCategory('convert-to')).toHaveLength(5);
    expect(getToolsByCategory('convert-from')).toHaveLength(4);
    expect(getToolsByCategory('security')).toHaveLength(3);
    expect(getToolsByCategory('ocr')).toHaveLength(1);
  });
});
