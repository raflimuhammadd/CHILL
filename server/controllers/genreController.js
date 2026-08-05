const genreService = require('../services/genreService');

exports.getAllGenres = async (req, res, next) => {
    try {
        const genres = await genreService.getAllGenres();

        res.status(200).json({
            success: true,
            data: genres
        });
    } catch (error) {
        next(error);
    }
};

exports.getGenreById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const genre = await genreService.getGenreById(Number(id));

        if (!id || isNaN(id) || Number(id) <= 0) {
            return res.status(400).json ({
                success: false,
                message: 'Invalid genre ID. Must be a positive number.'
            });
        }

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: genre
        })
    } catch (error) {
        next(error);
    }
};

exports.createGenre = async (req, res, next) => {
    try {
        const {name, slug} = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Genre name is required'
            });
        }

        const genreData = {
            name: name.trim(),
            ...(slug && {slug: slug.trim()})
        };

        const newGenre = await genreService.createGenre(genreData);

        res.status(201).json({
            success: true,
            message: 'Genre created successfully',
            data: newGenre
        });
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.message.includes('is required')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        next(error);
    }
};

exports.updateGenre = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name, slug} = req.body;

        if (!id || isNaN(id) || Number(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid genre ID. Must be a positive number.'
            });
        }

        if (!name && !slug) {
            return res.status(400).json({
                success: false,
                message: 'At least one of name or slug is required'
            });
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (slug) updateData.slug = slug.trim();

        const updatedGenre = await genreService.updateGenre(Number(id), updateData);

        return res.status(200).json({
            success: true,
            message: 'Genre updated successfully',
            data: updatedGenre
        })
    } catch (error) {
        if (error.message === 'Genre not found') {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        if (error.message.includes('already exists')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        next(error);
    }
};

exports.deleteGenre = async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!id || isNaN(id) || Number(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid genre ID. Must be a positive number.'
            });
        }

        await genreService.deleteGenre(Number(id));

        res.status(200).json({
            success: true,
            message: 'Genre deleted successfully'
        });

    } catch (error) {
        if (error.message === 'Genre not found') {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        next(error);
    }
};