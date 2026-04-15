import { validateTask, validateTaskStatus } from '@/lib/validations';

describe('validateTask', () => {
  it('should return false when titulo is empty', () => {
    const result = validateTask({ titulo: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El título es obligatorio');
  });

  it('should return false when titulo is only whitespace', () => {
    const result = validateTask({ titulo: '   ' });
    expect(result.valid).toBe(false);
  });

  it('should return true when task is valid', () => {
    const result = validateTask({ titulo: 'Test task' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return false when titulo exceeds 100 characters', () => {
    const longTitulo = 'a'.repeat(101);
    const result = validateTask({ titulo: longTitulo });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El título no puede exceder 100 caracteres');
  });

  it('should return false when descripcion exceeds 500 characters', () => {
    const longDescripcion = 'a'.repeat(501);
    const result = validateTask({ titulo: 'Test', descripcion: longDescripcion });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('La descripción no puede exceder 500 caracteres');
  });

  it('should return false when estado is invalid', () => {
    const result = validateTask({ titulo: 'Test', estado: 'INVALIDO' as 'PENDIENTE' | 'COMPLETADA' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El estado debe ser PENDIENTE o COMPLETADA');
  });

  it('should accept valid PENDIENTE estado', () => {
    const result = validateTask({ titulo: 'Test', estado: 'PENDIENTE' });
    expect(result.valid).toBe(true);
  });

  it('should accept valid COMPLETADA estado', () => {
    const result = validateTask({ titulo: 'Test', estado: 'COMPLETADA' });
    expect(result.valid).toBe(true);
  });
});

describe('validateTaskStatus', () => {
  it('should return true for PENDIENTE', () => {
    expect(validateTaskStatus('PENDIENTE')).toBe(true);
  });

  it('should return true for COMPLETADA', () => {
    expect(validateTaskStatus('COMPLETADA')).toBe(true);
  });

  it('should return false for invalid status', () => {
    expect(validateTaskStatus('INVALIDO')).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(validateTaskStatus(undefined)).toBe(false);
  });
});
