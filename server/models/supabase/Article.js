const supabase = require('../../config/supabase');

/**
 * Query Builder pour les articles (compatible avec Mongoose)
 */
class ArticleQuery {
  constructor(query = {}) {
    this.query = query;
    this.sortField = 'published_at';
    this.sortOrder = 'desc';
    this.limitValue = null;
    this.skipValue = 0;
  }

  sort(sortOptions) {
    if (typeof sortOptions === 'string') {
      this.sortField = Article.convertFieldName(sortOptions.startsWith('-') ? sortOptions.slice(1) : sortOptions);
      this.sortOrder = sortOptions.startsWith('-') ? 'desc' : 'asc';
    } else if (typeof sortOptions === 'object') {
      const field = Object.keys(sortOptions)[0];
      this.sortField = Article.convertFieldName(field);
      this.sortOrder = sortOptions[field] === -1 ? 'desc' : 'asc';
    }
    return this;
  }

  limit(value) {
    this.limitValue = value;
    return this;
  }

  skip(value) {
    this.skipValue = value;
    return this;
  }

  select(fields) {
    // Mongoose select - on l'ignore pour Supabase (on retourne toujours tous les champs)
    return this;
  }

  async exec() {
    let supabaseQuery = supabase.from('articles').select('*');

    // Filtres
    if (this.query.status) {
      supabaseQuery = supabaseQuery.eq('status', this.query.status);
    }

    if (this.query.tags) {
      supabaseQuery = supabaseQuery.contains('tags', [this.query.tags]);
    }

    // Tri
    supabaseQuery = supabaseQuery.order(this.sortField, { ascending: this.sortOrder === 'asc' });

    // Pagination
    if (this.limitValue) {
      if (this.skipValue > 0) {
        supabaseQuery = supabaseQuery.range(this.skipValue, this.skipValue + this.limitValue - 1);
      } else {
        supabaseQuery = supabaseQuery.limit(this.limitValue);
      }
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data.map(article => Article.formatArticle(article));
  }

  // Alias pour exec() pour compatibilité
  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

class Article {
  /**
   * Crée un nouvel article
   */
  static async create(data) {
    const article = {
      title: data.title,
      slug: data.slug || this.generateSlug(data.title),
      content: data.content,
      excerpt: data.excerpt,
      source_url: data.sourceUrl,
      scraped_data: data.scrapedData || {},
      cover_image: data.coverImage || null,
      tags: data.tags || [],
      status: data.status || 'draft',
      category: data.category || 'review',
      generated_by: data.generatedBy || 'manual',
      metadata: data.metadata || {},
      seo: data.seo || {},
      published_at: data.publishedAt || new Date().toISOString(),
    };

    const { data: result, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();

    if (error) throw error;
    return this.formatArticle(result);
  }

  /**
   * Trouve un article par ID
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return this.formatArticle(data);
  }

  /**
   * Trouve un seul article avec un filtre
   */
  static async findOne(query) {
    let supabaseQuery = supabase.from('articles').select('*');

    // Convertir les noms de champs et appliquer les filtres
    Object.keys(query).forEach(key => {
      const dbFieldName = this.convertFieldName(key);
      supabaseQuery = supabaseQuery.eq(dbFieldName, query[key]);
    });

    const { data, error } = await supabaseQuery.limit(1).single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.formatArticle(data);
  }

  /**
   * Convertit les noms de champs camelCase en snake_case
   */
  static convertFieldName(field) {
    const conversions = {
      'publishedAt': 'published_at',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'sourceUrl': 'source_url',
      'coverImage': 'cover_image',
      'scrapedData': 'scraped_data',
      'generatedBy': 'generated_by',
    };
    return conversions[field] || field;
  }

  /**
   * Trouve un article par slug
   */
  static async findBySlug(slug) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.formatArticle(data);
  }

  /**
   * Trouve tous les articles avec filtres (retourne un Query Builder)
   */
  static find(query = {}) {
    return new ArticleQuery(query);
  }

  /**
   * Compte les articles
   */
  static async countDocuments(query = {}) {
    let supabaseQuery = supabase.from('articles').select('*', { count: 'exact', head: true });

    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }

    const { count, error } = await supabaseQuery;
    if (error) throw error;
    return count;
  }

  /**
   * Met à jour un article
   */
  static async findByIdAndUpdate(id, updates, options = {}) {
    const updateData = {};
    
    // Mapper tous les champs possibles
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.publishedAt !== undefined) updateData.published_at = updates.publishedAt;
    if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
    if (updates.sourceUrl !== undefined) updateData.source_url = updates.sourceUrl;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;
    if (updates.seo !== undefined) updateData.seo = updates.seo;
    if (updates.scrapedData !== undefined) updateData.scraped_data = updates.scrapedData;
    if (updates.generatedBy !== undefined) updateData.generated_by = updates.generatedBy;

    // Si aucune mise à jour, retourner l'article existant
    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return options.new !== false ? this.formatArticle(data) : null;
    } catch (error) {
      console.error('Erreur mise à jour article:', error);
      throw error;
    }
  }

  /**
   * Supprime un article
   */
  static async findByIdAndDelete(id) {
    try {
      // D'abord, nettoyer les références dans url_queue
      await supabase
        .from('url_queue')
        .update({ article_id: null })
        .eq('article_id', id);

      // Ensuite, supprimer l'article
      const { data, error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.formatArticle(data);
    } catch (error) {
      console.error('Erreur suppression article:', error);
      throw error;
    }
  }

  /**
   * Génère un slug unique
   */
  static generateSlug(title) {
    let slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    return slug;
  }

  /**
   * Formate un article Supabase en format MongoDB-like
   */
  static formatArticle(article) {
    if (!article) return null;

    return {
      _id: article.id,
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      sourceUrl: article.source_url,
      scrapedData: article.scraped_data,
      coverImage: article.cover_image,
      tags: article.tags,
      status: article.status,
      generatedBy: article.generated_by,
      metadata: article.metadata,
      seo: article.seo,
      publishedAt: article.published_at,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
    };
  }
}

module.exports = Article;
