
function healthCheck(req, res) {
    // 1. La lógica simplemente envía la respuesta estática
    res.send('Backend corriendo');
}

module.exports = {
    healthCheck,
};