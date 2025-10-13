import unittest
import requests
import psycopg2 
from psycopg2 import pool 
import os 
from time import sleep

# --- 1. Configuración del Entorno (Lectura de Variables de Docker) ---
# Lee las variables de entorno definidas en docker-compose.yml
BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000") 
DB_CONFIG = {
    'user': os.getenv("DB_USER", "user"),
    'password': os.getenv("DB_PASSWORD", "password"),
    'host': os.getenv("DB_HOST", "localhost"), 
    'port': os.getenv("DB_PORT", "5432"),
    'database': os.getenv("DB_NAME", "mydb")
}

# --- 2. Clase de Pruebas de Conexión ---
class TestEnvironmentSetup(unittest.TestCase):

    # --- 2.1: Configuración de Clase (Verifica Conexión DB) ---
    @classmethod
    def setUpClass(cls):
        """
        Verifica que el contenedor de pruebas pueda conectarse a la DB.
        Este es el paso crucial para las futuras pruebas setUpClass.
        """
        print("\n--- Ejecutando setUpClass: Verificando Conexión a DB ---")
        
        # Intentamos obtener una conexión a la DB
        try:
            cls.db_pool = psycopg2.pool.SimpleConnectionPool(1, 10, **DB_CONFIG)
            conn = cls.db_pool.getconn()
            cursor = conn.cursor()
            
            # Prueba de consulta básica
            cursor.execute("SELECT 1;")
            result = cursor.fetchone()
            
            cls.db_pool.putconn(conn)
            print("✅ Conexión a PostgreSQL (postgres_db) exitosa.")
            
        except psycopg2.OperationalError as e:
            # Si hay un error, lo registramos. La prueba fallará si no puede conectar.
            print(f"❌ ERROR: Falló la conexión a PostgreSQL. Revisa DB_HOST: {DB_CONFIG['host']} y el servicio.")
            print(e)
            raise

    # --- 2.2: Limpieza de Clase (Cierra Conexión DB) ---
    @classmethod
    def tearDownClass(cls):
        """
        Se ejecuta una vez después de todas las pruebas para cerrar el pool de DB.
        """
        print("\n--- Ejecutando tearDownClass: Cerrando Conexión a DB ---")
        cls.db_pool.closeall()

    # --- 2.3: Prueba de Conexión a la API (Endpoint Básico) ---
    def test_01_api_connection_check(self):
        """
        Prueba que el contenedor de pruebas pueda acceder al backend de Node.js
        usando la ruta / y el nombre de servicio (backend:8000).
        """
        print("\n--- Ejecutando test_01_api_connection_check: Verificando Backend ---")
        
        # Retraso para dar tiempo al backend de Express para iniciar completamente
        sleep(2) 

        try:
            response = requests.get(f"{BASE_URL}/")
            
            # El backend monolítico devuelve "Backend corriendo" y 200 OK.
            self.assertEqual(response.status_code, 200, "El endpoint principal (/) no devuelve 200 OK.")
            self.assertIn("Backend corriendo", response.text, "El mensaje de bienvenida del backend no es el esperado.")
            
            print("Conexión a la API (backend) exitosa. Entorno montado correctamente.")
            print("𝕾𝖐𝖎𝖇𝖎𝖉𝖎 𝕿𝖔𝖎𝖑𝖊𝖙")
            
        except requests.exceptions.ConnectionError as e:
            self.fail(f"❌ Falló la conexión a la API en {BASE_URL}. Revisa API_BASE_URL en docker-compose.yml. Error: {e}")

# --- 3. Ejecución Principal ---
if __name__ == '__main__':
    unittest.main()