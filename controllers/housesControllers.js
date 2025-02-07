// Import
const connection = require('../data/bnb_db');
const slugify = require('slugify');

// Index
const index = (req, res) => {
    console.log("Sto inviando i dati");

    const sql = `
        SELECT DISTINCT annunci.* 
        FROM annunci 
        JOIN cuoricini
        ON annunci.id = cuoricini.annuncio_id
        ORDER BY annunci.likes DESC
    `

    connection.query(sql, (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' })
        res.status(200).json({ data: result })
    })
};

// Show
const show = (req, res) => {
    const slug = req.params.slug

    const announcementSql = `
        SELECT * 
        FROM annunci 
        WHERE slug = ?
    `

    const reviewsSql = `
        SELECT recensioni.* 
        FROM  annunci
        JOIN recensioni
        ON annunci.id = recensioni.annuncio_id
        WHERE annunci.slug = ?
    `

    connection.query(announcementSql, [slug], (err, announcementResults) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' })
        if (announcementResults.length === 0 || announcementResults.id === null) {
            return res.status(404).json({ error: "item not found" })
        }
        // recuperare l'annuncio
        const announcement = announcementResults[0]

        connection.query(reviewsSql, [slug], (err, reviewResults) => {
            if (err)
                return res.status(500).json({ error: 'Database query failed' })

            announcement.review = reviewResults

            res.status(200).json(announcement)
        })
    })
}

// Store House
const storeHouse = (req, res) => {
    const { utente_id, tipologia, prezzo_notte, titolo_annuncio, descrizione_annuncio, indirizzo, città, paese, capienza, metri_quadri, numero_camere, numero_letti, numero_bagni, data_creazione } = req.body

    const slug = slugify(titolo_annuncio, {
        lower: true,
        strict: true,
    })

    const sql = `
        INSERT INTO annunci(utente_id, tipologia, prezzo_notte, titolo_annuncio, slug, descrizione_annuncio, indirizzo, città, paese, capienza, metri_quadri, numero_camere, numero_letti, numero_bagni, data_creazione)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(sql, [utente_id, tipologia, prezzo_notte, titolo_annuncio, slug, descrizione_annuncio, indirizzo, città, paese, capienza, metri_quadri, numero_camere, numero_letti, numero_bagni, data_creazione], (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed', err: err.stack })

        res.status(201).json({ message: "Appartamento aggiunto" })
    })
};

// Store review
const storeReview = (req, res) => {
    const announcementId = req.params.id
    const { utente_id, nome, commento, giorni_permanenza, data_recensione } = req.body

    const sql = `
        INSERT INTO recensioni( utente_id, annuncio_id, nome, commento, giorni_permanenza, data_recensione)
        VALUES (?,?,?,?,?,?)    
    `
    connection.query(sql, [utente_id, announcementId, nome, commento, giorni_permanenza, data_recensione], (err, results) => {
        if (err)
            return res.status(500).json({ error: "Database query failed", err: err.stack })
        if (announcementId === null)
            return res.status(404).json({ error: "Item not found" })
        res.status(201).json({ message: "Recensione aggiunta" })
    })
}

// Store like
const storeLike = (req, res) => {
    const announcementId = req.params.id
    const { utente_id } = req.body
    const data_assegnazione = new Date();

    const sql = `
        UPDATE annunci
        SET likes = likes + 1
        WHERE annunci.id = ?
    `

    const addLikeSql = `
        INSERT INTO Cuoricini(utente_id, annuncio_id, data_assegnazione)
        VALUES (?, ?, ?)
    `

    connection.query(sql, [announcementId], (err, result) => {
        if (err)
            return res.status(500).json({ error: "Database query failed", err: err.stack })
        if (announcementId === null)
            return res.status(404).json({ error: "Item not found" })

        connection.query(addLikeSql, [utente_id, announcementId, data_assegnazione], (err, addLikeResult) => {
            if (err)
                return res.status(500).json({ error: "Database query failed", err: err.stack })
            res.status(201).json({ message: "Like aggiornato e aggiunto" })
        })
    })
}

// Destroy
const destroy = (req, res) => {

};

module.exports = {
    index,
    show,
    storeHouse,
    storeReview,
    storeLike,
    destroy
}