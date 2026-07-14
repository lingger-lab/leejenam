export const ENGRAVE_PATTERN = /^[가-힣]{1,10}$/;

type ValidationResult = { ok: true } | { ok: false; error: string };

export function validateEngraveName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { ok: false, error: '라벨에 새길 이름을 알려주세요.' };
  }

  const trimmed = name.trim();

  if (trimmed.length > 10) {
    return { ok: false, error: '이름은 10자까지 쓸 수 있습니다.' };
  }

  if (!ENGRAVE_PATTERN.test(trimmed)) {
    return { ok: false, error: '한글 이름만 새길 수 있습니다.' };
  }

  return { ok: true };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { ok: false, error: '연락처를 입력해주세요.' };
  }

  // Remove hyphens and spaces for validation
  const cleaned = phone.replace(/[\s-]/g, '');

  // Korean phone number: 010, 011, 016, 017, 018, 019 followed by 7-8 digits
  const phonePattern = /^01[0-9]\d{7,8}$/;

  if (!phonePattern.test(cleaned)) {
    return { ok: false, error: '올바른 연락처를 입력해주세요.' };
  }

  return { ok: true };
}
