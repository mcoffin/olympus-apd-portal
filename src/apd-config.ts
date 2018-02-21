export function rankOrder(rank: string): number {
    return ranks.indexOf(rank);
}

export const ranks: string[] = [
    'Deputy',
    'Patrol Officer',
    'Corporal',
    'Sergeant',
    'Lietenant',
    'Deputy Chief of Police',
    'Chief of Police',
];

export const squads: string[] = [
    'Alpha',
    'Bravo',
    'Charlie',
    'Delta',
    'Echo',
    'Foxtrot',
    'Exemptions',
];
