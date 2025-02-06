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
        ORDER BY annunci.like DESC
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
            console.log(announcement);
        })
    })
}

// Store
const store = (req, res) => {
    const { utente_id, tipologia, prezzo_notte, titolo_annuncio, descrizione_annuncio, indirizzo, città, paese, capienza, metri_quadri, numero_camere, numero_letti, numero_bagni, data_creazione } = req.body
    // console.log(req.body);

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

// Destroy
const destroy = (req, res) => {

};

module.exports = {
    index,
    show,
    store,
    destroy
}