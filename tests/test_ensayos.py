import os
import unittest
import requests

BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000")
LOGIN_PATH = os.environ.get("LOGIN_PATH", "/login")                
LOGOUT_PATH = os.environ.get("LOGOUT_PATH", "/logout")
ENSAYOS_PATH = os.environ.get("PREGUNTAS_PATH", "/ensayos") # ruta para POST preguntas

EST_RUT = os.environ.get("PROF_RUT", "55667788-9")
EST_PASS = os.environ.get("PROF_PASS", "alumnocomun")

class TestEssaysEndpoint(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.session = requests.Session()
        login_url = f"{BASE_URL}{LOGIN_PATH}"
        login_payload = {"rut": EST_RUT, "contraseña": EST_PASS}

        r = cls.session.post(login_url, json=login_payload)
        if r.status_code not in (200, 204):
            raise RuntimeError(
                f"No se pudo iniciar sesión como alumno. Status {r.status_code} - {r.text}\n"
                "Ajusta BASE_URL / LOGIN_PATH / credenciales."
            )
        try:
            cls.login_json = r.json()
        except Exception:
            cls.login_json = None

    @classmethod
    def tearDownClass(cls):
        pass

    def test_submit_essay_valid(self):
        """Caso B1: envío válido -> 200 y contiene puntaje"""
        payload = {
            "ensayo_id": 7,
            "student_id": 2,
            "answers": [
                {"question_id": 1, "answer": "B"},
                {"question_id": 2, "answer": "A"},
            ]
        }
        r = requests.post(f"{BASE_URL}/ensayos/1/responder", headers=self.headers, json=payload)
        self.assertEqual(r.status_code, 200, f"Status inesperado: {r.status_code} {r.text}")
        data = r.json()
        self.assertIn("puntaje", data, "La respuesta debe contener el campo 'puntaje'")
        self.assertIsInstance(data["puntaje"], (int, float))
        self.assertIn("details", data)
        self.assertIsInstance(data["details"], list)
        self.assertEqual(len(data["details"]), len(payload["answers"]))

    def test_submit_essay_invalid_answers_format(self):
        """Caso B2: answers no es una lista -> 400/422"""
        payload = {
            "ensayo_id": 7,
            "student_id": 12,
            "answers": "esta_no_es_una_lista"
        }
        r = requests.post(f"{BASE_URL}/essays/submit", headers=self.headers, json=payload)
        self.assertIn(r.status_code, (400, 422), msg=f"Se esperaba error de validación, obtuve {r.status_code}")
        data = r.json()
        self.assertTrue(any(k in data for k in ("error", "message", "errors")),
                        f"Respuesta de validación inesperada: {data}")

if __name__ == "__main__":
    unittest.main()