import { supabase } from '../lib/supabase';

export const runAllocation = async (type: 'tutor' | 'elective' | 'club') => {
    // 1. Get all available items for the type with their slots
    const { data: items } = await supabase
        .from('items')
        .select('*')
        .eq('type', type);

    if (!items) return { success: false, message: 'Nenhum item encontrado.' };

    // 2. Get all choices for the type, ordered by timestamp (first-come first-served)
    const { data: choices } = await supabase
        .from('choices')
        .select('*')
        .eq('type', type)
        .order('timestamp', { ascending: true });

    if (!choices) return { success: false, message: 'Nenhuma escolha encontrada.' };

    // 3. Clear previous allocations for this type
    await supabase.from('allocations').delete().eq('type', type);

    // 4. Temporary storage for slots count
    const itemSlots = items.reduce((acc, item) => {
        acc[item.id] = item.slots;
        return acc;
    }, {} as Record<string, number>);

    const allocations = [];
    const unallocated = [];

    // 5. Allocation Algorithm
    for (const choice of choices) {
        let assigned = false;
        const priorities = [choice.p1, choice.p2, choice.p3, choice.p4, choice.p5];

        for (const itemId of priorities) {
            if (itemId && itemSlots[itemId] > 0) {
                allocations.push({
                    student_ra: choice.student_ra,
                    item_id: itemId,
                    type: type
                });
                itemSlots[itemId]--;
                assigned = true;
                break;
            }
        }

        if (!assigned) {
            unallocated.push(choice.student_ra);
        }
    }

    // 6. Save allocations in batches
    if (allocations.length > 0) {
        const { error } = await supabase.from('allocations').insert(allocations);
        if (error) return { success: false, message: error.message };
    }

    return {
        success: true,
        allocatedCount: allocations.length,
        unallocatedCount: unallocated.length,
        unallocatedList: unallocated
    };
};
