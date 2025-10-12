# tests/test_preguntas_session.py
import os
import unittest
import requests

BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000") 
LOGIN_PATH = os.environ.get("LOGIN_PATH", "/login")                
LOGOUT_PATH = os.environ.get("LOGOUT_PATH", "/logout")
PREGUNTAS_PATH = os.environ.get("PREGUNTAS_PATH", "/preguntas") # ruta para POST preguntas

PROF_RUT = os.environ.get("PROF_RUT", "11223344-5")
PROF_PASS = os.environ.get("PROF_PASS", "profesor123")

ASIGNATURAS = {
    "Matemáticas": 1,
    "Lenguaje": 2,
    "Historia": 3,
    "Ciencias": 4
}

class TestPreguntasSessionAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.session = requests.Session()
        login_url = f"{BASE_URL}{LOGIN_PATH}"
        login_payload = {"rut": PROF_RUT, "contraseña": PROF_PASS}

        r = cls.session.post(login_url, json=login_payload)
        if r.status_code not in (200, 204):
            raise RuntimeError(
                f"No se pudo iniciar sesión como profesor. Status {r.status_code} - {r.text}\n"
                "Ajusta BASE_URL / LOGIN_PATH / credenciales."
            )
        try:
            cls.login_json = r.json()
        except Exception:
            cls.login_json = None

        cls.profesor_id = PROF_RUT

    @classmethod
    def tearDownClass(cls):
        try:
            cls.session.post(f"{BASE_URL}{LOGOUT_PATH}")
        except Exception:
            pass
        cls.session.close()

    def _debug_response(self, resp, label="RESP"):
        try:
            body = resp.json()
        except Exception:
            body = resp.text
        print(f"\n--- {label} ---\nstatus: {resp.status_code}\nbody: {body}\nheaders: {resp.headers}\n--- /{label} ---\n")

    def test_create_question_authenticated_with_topico_text_creates_tematica(self):
        asignatura_id = ASIGNATURAS["Ciencias"]
        topico_text = "Geografía"
        enunciado = "¿Cuál es la capital de Francia?"

        payload = {
            "id_asignatura": 4,
            "id_profesor": 1,
            "topico": "Geografía",
            "pregunta": "¿Cuál es la capital de Francia?2",
            "imagen": None,
            "respuestas": [
                {"texto": "París", "es_correcta": True},
                {"texto": "Londres", "es_correcta": False},
                {"texto": "Berlín", "es_correcta": False},
                {"texto": "Berlín", "es_correcta": False}

            ]
        }
        resp = self.session.post(f"{BASE_URL}{PREGUNTAS_PATH}", json=payload)
        
        if resp.status_code not in (200, 201):
            self._debug_response(resp, label="CREATE_INITIAL_RESP")
            self.fail(f"Creación falló con código {resp.status_code}: {resp.text}")


        try:
            data = resp.json()
        except Exception as ex:
            self._debug_response(resp, label="CREATE_NO_JSON")
            self.fail(f"Respuesta no JSON. Error parseando JSON: {ex}")
        if isinstance(data, dict) and "created" in data or "id_pregunta" in data or "success" in data:
            self.assertTrue(data.get("success", True) or data.get("id_pregunta") or data.get("created"))
        else:
            preguntas = data if isinstance(data, list) else data.get("preguntas", [])
            self.assertIsInstance(preguntas, list)
            self.assertGreater(len(preguntas), 0)
            created = preguntas[0]
            self.assertEqual(created.get("pregunta") or created.get("enunciado"), payload["pregunta"])
            autor_val = created.get("autor") or created.get("id_profesor") or created.get("profesor")
            self.assertIsNotNone(autor_val)

    def test_create_question_missing_fields(self):
        # Enviamos lista con objeto con enunciado vacío => esperamos validación 400/422
        payload = [{"id_asignatura": ASIGNATURAS["Ciencias"], "topico": "X", "enunciado": ""}]
        r = self.session.post(f"{BASE_URL}{PREGUNTAS_PATH}", json=payload)
        self.assertIn(r.status_code, (400, 422), f"Se esperaba 400/422, obtuve {r.status_code} - {r.text}")

    def test_create_question_unauthenticated(self):
        payload = [{
            "id_asignatura": ASIGNATURAS["Ciencias"],
            "topico": "TestAnon",
            "enunciado": "Intento sin login"
        }]
        anon = requests.Session()
        r = anon.post(f"{BASE_URL}{PREGUNTAS_PATH}", json=payload)
        self.assertIn(r.status_code, (401, 403), f"Se esperaba 401/403, obtuve {r.status_code} - {r.text}")
        anon.close()

if __name__ == "__main__":
    unittest.main(verbosity=2)

