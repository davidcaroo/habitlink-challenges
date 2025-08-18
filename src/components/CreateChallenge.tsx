
import { useState } from "react";
import { Target, Calendar, Users, FileText } from "lucide-react";

export default function CrearRetoPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      description,
      participants,
      deadline,
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full h-full px-4 py-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Crear Nuevo Reto
            </h1>
            <p className="text-gray-600 text-lg">
              Define tu desafío personal o grupal y comienza a construir nuevos hábitos
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-green-200/50 overflow-hidden w-full h-full">
            <form onSubmit={handleSubmit} className="p-6 md:p-8 h-full">
              <div className="grid md:grid-cols-2 gap-8 h-full">
                {/* Columna izquierda */}
                <div className="space-y-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del Reto
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. 30 días de ejercicio"
                        className="w-full pl-4 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción
                    </label>
                    <div className="relative">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe el reto y sus objetivos..."
                        rows={4}
                        className="w-full pl-4 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-6">
                  {/* Participantes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Participantes
                    </label>
                    <div className="relative">
                      <Users className="w-5 h-5 text-green-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                        placeholder="Número de participantes"
                        className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Fecha límite */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha Límite
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-green-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón submit */}
              <div className="mt-8 pt-6 border-t border-green-200/50">
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
                >
                  {name.trim() ? `Crear reto: ${name}` : "Crear reto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}