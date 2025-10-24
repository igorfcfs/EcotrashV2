export type Eletronico = {
    id: string;
    categoria: string;
    massa: number;
    criadoEm: Date | string;
    localDescarte?: string;
    foto?: string;
    pontos?: number;
};