import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useToast } from '@/composables/useToast';

beforeEach(() => {
    const { toasts } = useToast();
    toasts.value = [];
})

describe('useToast', () => {
    test('Deve adicionar um toast de sucesso', () => {
        const toast = useToast();
        toast.success('Operação realizada!');

        expect(toast.toasts.value).toHaveLength(1);
        expect(toast.toasts.value[0]?.message).toBe('Operação realizada!');
        expect(toast.toasts.value[0]?.type).toBe('success');
    })

    test('Deve adicionar um toast de erro', () => {
        const toast = useToast();
        toast.error('Ocorreu um erro!');

        expect(toast.toasts.value[0]?.type).toBe('error');
    })

    test('Deve remover o toast após o tempo definido', () => {
        // vi.useFakeTimers = controla o tempo nos testes
        // sem isso, o teste precisaria esperar 3.5 segundos de verdade
        vi.useFakeTimers();

        const toast = useToast();
        toast.success('Vai sumir');
        expect(toast.toasts.value).toHaveLength(1);

        // Avança o tempo 4 segundos (mais que os 3.5 do timeout)
        vi.advanceTimersByTime(4000);
        expect(toast.toasts.value).toHaveLength(0);

        vi.useRealTimers();
    })

    test('Deve suportar múltiplos toasts simultâneos', () => {
        const toast = useToast();
        toast.success('Mensagem 1');
        toast.error('Mensagem 2');
        toast.info('Mensagem 3');

        expect(toast.toasts.value).toHaveLength(3);
    })
})