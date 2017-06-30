import { GAME_NAME } from '../const';

export const getResource = (type: string, name: string) => `/static/${GAME_NAME}/${type}s/${name}`;
export const Background = (name: string) => getResource('background', name);