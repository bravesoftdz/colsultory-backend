const models = require('../../../models')

function getClients() {
    return models.client.findAll({})
}

function createClient(clients,adminId) {
    return models.client.create({
        image: clients.image,
        title: clients.title,
        createdBy: adminId
    })
}

function editClient(id, client) {
    return models.client.update({ image: client.image, title: client.title}, { where: {id}})
}

function deleteClient(id) {
    return models.client.destroy({ where : {id}})
}

function getClient(id) {
    return models.client.findOne({ where : {id}})
}

module.exports = {
    createClient,
    getClients,
    editClient,
    getClient,
    deleteClient,
}