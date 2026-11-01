import { describe, expect, it } from 'vitest';
import { normalizeUrl, scholarSearchUrl } from './links';

describe('links', () => {
  it('accepts pasted links with or without https', () => {
    expect(normalizeUrl(' drive.google.com/file/d/abc ')).toBe('https://drive.google.com/file/d/abc');
    expect(normalizeUrl('http://example.com/a')).toBe('http://example.com/a');
  });

  it('rejects things that are not web links', () => {
    expect(normalizeUrl('')).toBeNull();
    expect(normalizeUrl('פרק 2')).toBeNull();
    expect(normalizeUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeUrl('ftp://x.com')).toBeNull();
  });

  it('builds a Scholar search', () => {
    expect(scholarSearchUrl('Sensitive periods', 'Zeanah')).toBe(
      'https://scholar.google.com/scholar?q=Sensitive%20periods%20Zeanah',
    );
  });
});
