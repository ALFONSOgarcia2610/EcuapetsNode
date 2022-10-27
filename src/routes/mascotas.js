const express = require('express');
const router = express.Router();
const path = require('path');
const Mascota = require('../models/Mascota');
const Reporte = require('../models/Reporte');
const Photo = require('../models/Photo');
const User = require('../models/user');
const cloudinary = require('cloudinary');
const qrcode = require('qrcode');
const Axios = require('axios');
cloudinary.config({
    cloud_name: "dxeymupkr",
    api_key: "952215639699969",
    api_secret: "n-AcWcP6fhnJvHIa5fFCEOMgsu8"
});
const fs = require('fs-extra');
const { isAuthenticated } = require('../helpers/auth');
const app = require('..');
const { nextTick } = require('process');

router.get('/mascotas/agregar', isAuthenticated, (req, res) => {
    res.render('mascotas/new-mascotas');
});
router.post('/mascotas/new-mascotas', isAuthenticated, async (req, res) => {
    const { nombre, especie, raza, genero, fechanacimiento, v1,
        fechav1, v2, fechav2, v3, fechav3, v4, fechav4, v5, fechav5, descripcion,
        medicamentos } = req.body;
        const newMascota = Mascota({
            nombre, especie, raza, genero, fechanacimiento, v1,
            fechav1, v2, fechav2, v3, fechav3, v4, fechav4, v5, fechav5, descripcion,
            medicamentos
        });
        newMascota.propietario = req.user.id;
        await newMascota.save();
        req.flash('success_msg', 'Mascota Agregada Satisfactoriamente');
        res.redirect('/mascotas');
});
router.get('/mascotas', isAuthenticated, async (req, res) => {
    const mascotas = await Mascota.find({propietario: req.user.id}).lean().sort({ date: 'desc'});
    res.render('mascotas/all-mascotas', { mascotas});
    console.log(mascotas.Photo);
});
router.get('/mascotas/reportadas', isAuthenticated, async (req, res) => {
    const mascotas = await Mascota.find({estado: 1}).lean().sort({ date: 'desc' });
    const reporte = await Reporte.find().lean();
    res.render('mascotas/all-extravio', { mascotas, reporte});
    console.log(mascotas.nombre);
});
router.get('/mascotas/edit/:id', isAuthenticated, async (req, res) => {
    const mascota = await Mascota.findById(req.params.id).lean();
    const photos = await Photo.find({Mascota: req.params.id}).lean();
    const QR = await qrcode.toDataURL("https://ecuapets.herokuapp.com/mascotas/info/" + req.params.id);
    res.render('mascotas/edit-mascotas', { mascota, photos, QR});
});
router.get('/mascotas/addfotos/:id', isAuthenticated, async (req, res) => {
    const mascota = await Mascota.findById(req.params.id).lean();
    const photos = await Photo.find({Mascota: req.params.id}).lean();
    const QR = await qrcode.toDataURL("https://ecuapets.herokuapp.com/mascotas/info/" + req.params.id);
    res.render('mascotas/add-fotos', { mascota, photos, QR});
});
router.get('/mascotas/reporte/:id', isAuthenticated,  async (req, res) => {
    const mascota = await Mascota.findById(req.params.id).lean();
    res.render('mascotas/repor-mascotas', {mascota});
});
router.get('/mascotas/info/:id', async (req, res) => {
    const mascota = await Mascota.findById(req.params.id).lean();
    const photos = await Photo.find({Mascota: req.params.id}).lean();
    const reporte = await Reporte.findOne({Mascota: req.params.id}).lean().sort({ date: 'desc' });
    const usuario = await User.findOne({_id: mascota.propietario});
    const QR = await qrcode.toDataURL("https://ecuapets.herokuapp.com/mascotas/info/" + req.params.id);
    res.render('mascotas/info-mascotas', {usuario, mascota, photos, QR, reporte});
  
});
router.put('/mascotas/repor-mascotas/:id', async (req, res) => {
    const { estado } = req.body;
    await Mascota.findByIdAndUpdate(req.params.id, {estado:1});
    const { lugar, detalle, recompensa } = req.body;
        const newReporte = new Reporte({
            lugar, detalle, recompensa
        });
        newReporte.Mascota = req.params.id;
        await newReporte.save();
        req.flash('success_msg', 'Mascota Reportada Satisfactoriamente');
        res.redirect('/mascotas');
});
router.put('/mascotas/recu-mascotas/:id', async (req, res) => {
    const { estado } = req.body;
    await Mascota.findByIdAndUpdate(req.params.id, {estado:null});
        req.flash('success_msg', 'Estado de Mascota Actualizado Satisfactoriamente');
        res.redirect('/mascotas');
});
router.put('/mascotas/addfotos/:id', async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const newPhoto = new Photo({
        imageURL: result.url,
        public_id: result.original_filename
    });
    console.log(result.original_filename);
    newPhoto.Mascota = req.params.id;
    await newPhoto.save();
    await fs.unlink(req.file.path);
    await Mascota.findByIdAndUpdate(req.params.id, { perfil: result.url});
        req.flash('success_msg', 'Foto Agregada Satisfactoriamente');
        res.redirect('/mascotas');
});
router.put('/mascotas/edit-mascotas/:id', async (req, res) => {
    const { v1, fechav1, v2, fechav2, v3, fechav3, v4, fechav4, v5, fechav5,
    descripcion, medicamentos } = req.body;
    await Mascota.findByIdAndUpdate(req.params.id, { v1, fechav1, v2, fechav2, v3, fechav3, v4, fechav4, v5, fechav5,
        descripcion, medicamentos});
        req.flash('success_msg', 'Mascota Actualizada Satisfactoriamente');
        res.redirect('/mascotas');
});
router.delete('/mascotas/delete/:id', isAuthenticated, async (req, res) => {
    await Mascota.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Mascota Eliminada Satisfactoriamente');
    res.redirect('/mascotas');
});
router.get('/images/delete/:photo_id', async (req, res)=>{
const {photo_id} = req.params;
const photo = await Photo.findByIdAndDelete(photo_id);
const result = await cloudinary.v2.uploader.destroy(photo.public_id);
res.redirect('/mascotas');
});
module.exports = router; 
