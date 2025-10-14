import os
import unittest
import requests

BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000")
LOGIN_PATH = os.environ.get("LOGIN_PATH", "/login")

EST_RUT = os.environ.get("EST_RUT", "55667788-9")
EST_PASS = os.environ.get("EST_PASS", "alumnocomun")

class TestEssaysEndpoint(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.session = requests.Session()
        login_url = f"{BASE_URL}{LOGIN_PATH}"
        login_payload = {"rut": EST_RUT, "contraseña": EST_PASS}

        r = cls.session.post(login_url, json=login_payload)
        # print("Login status:", r.status_code)
        # print("Login response:", r.text)
        # print("Login headers:", r.headers)
        # print("Session cookies:", cls.session.cookies.get_dict())
        r.raise_for_status()
        try:
            cls.login_json = r.json()
        except Exception:
            cls.login_json = None

    @classmethod
    def tearDownClass(cls):
        cls.session.close()

    def _parse_resp(self, resp):
        try:
            return resp.json()
        except Exception:
            return {"text": resp.text}

    def test_submit_essay_valid(self):
        """Caso 1: envío válido -> 200/201 y contiene puntaje y conteos"""
        payload = {
            "respuestas": [
                {"id_pregunta": 1, "respuesta": "B"},
                {"id_pregunta": 2, "respuesta": "A"},
            ],
            "tiempo": 30
        }
        r = self.session.post(f"{BASE_URL}/ensayos/1/responder", json=payload)

        self.assertIn(r.status_code, (200, 201), f"Status inesperado: {r.status_code} {r.text}")

        data = self._parse_resp(r)

        self.assertIn("puntaje", data, f"Falta 'puntaje' en la respuesta: {data}")
        self.assertIsInstance(data["puntaje"], (int, float))

        for k in ("correctas", "erroneas", "omitidas"):
            self.assertIn(k, data, f"Falta '{k}' en la respuesta: {data}")
            # pueden ser ints (0 o más)
            self.assertIsInstance(data[k], int)

    def test_submit_essay_invalid_answers_format(self):
        """Caso 2: answers no es una lista -> 400/422"""
        payload = {
            "respuestas": "esto_no_es_una_lista"
        }
        r = self.session.post(f"{BASE_URL}/ensayos/1/responder", json=payload)
        self.assertIn(r.status_code, (400, 422), msg=f"Se esperaba error de validación, obtuve {r.status_code} {r.text}")
        data = self._parse_resp(r)
        has_error = any(k in data for k in ("error", "message", "errors", "text"))
        self.assertTrue(has_error, f"Respuesta de validación inesperada: {data}")


    def test_submit_essay_unauthenticated_valid(self):
        """Caso 3: envío válido sin autenticación -> 401/403"""
        anon = requests.Session()  # sesión sin login
        try:
            payload = {
                "respuestas": [
                    {"id_pregunta": 1, "respuesta": "B"},
                    {"id_pregunta": 2, "respuesta": "A"},
                ],
                "tiempo": 30
            }
            r = anon.post(f"{BASE_URL}/ensayos/1/responder", json=payload)
            # esperamos no autorizado (401 o 403). Algunas APIs devuelven 401, otras 403.
            self.assertIn(r.status_code, (401, 403),
                          f"Se esperaba 401/403 para request sin autenticar, obtuve {r.status_code} {r.text}")
        finally:
            anon.close()

    def test_submit_essay_unauthenticated_invalid_format(self):
        """Caso 4: envío inválido sin autenticación -> preferible 401/403, pero aceptar 400/422 si ocurre antes"""
        anon = requests.Session()
        try:
            payload = {"respuestas": "esto_no_es_una_lista"}
            r = anon.post(f"{BASE_URL}/ensayos/1/responder", json=payload)
            # Si la API chequea sesión primero probablemente devuelva 401/403.
            # Si valida payload primero puede devolver 400/422. Aceptamos ambos comportamientos.
            self.assertIn(r.status_code, (401, 403, 400, 422),
                          f"Se esperaba 401/403 o 400/422, obtuve {r.status_code} {r.text}")
            # comprobar que existe algún mensaje/indicación de error (JSON o texto)
            try:
                data = r.json()
            except Exception:
                data = {"text": r.text}
            has_error = any(k in data for k in ("error", "message", "errors", "text"))
            self.assertTrue(has_error, f"Respuesta inesperada: {data}")
        finally:
            anon.close()

if __name__ == "__main__":
    unittest.main(verbosity=2)