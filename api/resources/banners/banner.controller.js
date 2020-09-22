const models = require('../../../models')

function getBanners() {
    return models.banner.findAll({})
}

function createBanner(banner,adminId) {
    return models.banner.create({
        image: banner.image,
        title: banner.title,
        createdBy: adminId
    })
}

function editBanner(id, banner) {
    return models.banner.update({ image: banner.image, title: banner.title}, { where: {id}})
}

function deleteBanner(id) {
    return models.banner.destroy({ where : {id}})
}

function getBanner(id) {
    return models.banner.findOne({ where: {id}});
}

module.exports = {
    createBanner,
    getBanners,
    editBanner,
    getBanner,
    deleteBanner,
}