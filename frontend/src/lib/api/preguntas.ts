
export const PreguntasService = {
    async getAll() {
        const res = await fetch("http://localhost:8000/preguntas", {
            credentials: 'include'
        });
        return await res.json();
    },

    async getById(id: string) {
        const res = await fetch(`http://localhost:8000/preguntas/${id}`, {
            credentials: 'include'
        });
        return await res.json();
    }
};
