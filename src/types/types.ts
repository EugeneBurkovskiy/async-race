export interface ICar {
  name: string;
  color: string;
  id: number;
}

export interface IEngine {
  velocity: number;
  distance: number;
  success: boolean;
}

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}
