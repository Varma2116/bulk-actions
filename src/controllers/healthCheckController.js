
exports.healthCheck = async (req, res) => {
    res.status(200).json({ "message": "Service is UP" });  
};

