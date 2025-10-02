const supabase = require('../../config/supabase');

/**
 * Query Builder pour la queue (compatible avec Mongoose)
 */
class UrlQueueQuery {
  constructor(query = {}) {
    this.query = query;
    this.sortField = 'created_at';
    this.sortOrder = 'desc';
    this.limitValue = null;
    this.populateFields = [];
  }

  sort(sortOptions) {
    if (typeof sortOptions === 'string') {
      this.sortField = this.convertFieldName(sortOptions.startsWith('-') ? sortOptions.slice(1) : sortOptions);
      this.sortOrder = sortOptions.startsWith('-') ? 'desc' : 'asc';
    } else if (typeof sortOptions === 'object') {
      const field = Object.keys(sortOptions)[0];
      this.sortField = this.convertFieldName(field);
      this.sortOrder = sortOptions[field] === -1 ? 'desc' : 'asc';
    }
    return this;
  }

  convertFieldName(field) {
    // Convertir camelCase en snake_case pour Supabase
    const conversions = {
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'addedBy': 'added_by',
      'articleId': 'article_id',
      'retryCount': 'retry_count',
      'processedAt': 'processed_at',
    };
    return conversions[field] || field;
  }

  limit(value) {
    this.limitValue = value;
    return this;
  }

  populate(field) {
    this.populateFields.push(field);
    return this;
  }

  async exec() {
    const selectFields = this.populateFields.includes('articleId') 
      ? '*, articles(id, title, slug)' 
      : '*';
    
    let supabaseQuery = supabase.from('url_queue').select(selectFields);

    // Filtres
    if (this.query.status) {
      if (this.query.status.$in) {
        supabaseQuery = supabaseQuery.in('status', this.query.status.$in);
      } else {
        supabaseQuery = supabaseQuery.eq('status', this.query.status);
      }
    }

    // Tri
    supabaseQuery = supabaseQuery.order(this.sortField, { ascending: this.sortOrder === 'asc' });

    // Pagination
    if (this.limitValue) {
      supabaseQuery = supabaseQuery.limit(this.limitValue);
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data.map(item => UrlQueue.formatQueueItem(item));
  }

  // Alias pour exec() pour compatibilité
  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

class UrlQueue {
  /**
   * Crée une nouvelle entrée dans la queue
   */
  static async create(data) {
    const queueItem = {
      url: data.url,
      status: data.status || 'pending',
      added_by: data.addedBy || 'manual',
      article_id: data.articleId || null,
      error: data.error || null,
      retry_count: data.retryCount || 0,
      processed_at: data.processedAt || null,
    };

    const { data: result, error } = await supabase
      .from('url_queue')
      .insert([queueItem])
      .select()
      .single();

    if (error) throw error;
    return this.formatQueueItem(result);
  }

  /**
   * Trouve une entrée par URL
   */
  static async findOne(query) {
    let supabaseQuery = supabase.from('url_queue').select('*');

    if (query.url) {
      supabaseQuery = supabaseQuery.eq('url', query.url);
    }

    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }

    const { data, error } = await supabaseQuery.limit(1).single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.formatQueueItem(data);
  }

  /**
   * Trouve toutes les entrées avec filtres (retourne un Query Builder)
   */
  static find(query = {}) {
    return new UrlQueueQuery(query);
  }

  /**
   * Compte les documents
   */
  static async countDocuments(query = {}) {
    let supabaseQuery = supabase.from('url_queue').select('*', { count: 'exact', head: true });

    if (query.status) {
      if (query.status.$in) {
        supabaseQuery = supabaseQuery.in('status', query.status.$in);
      } else {
        supabaseQuery = supabaseQuery.eq('status', query.status);
      }
    }

    const { count, error } = await supabaseQuery;
    if (error) throw error;
    return count;
  }

  /**
   * Trouve par ID
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('url_queue')
      .select('*, articles(id, title, slug)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.formatQueueItem(data);
  }

  /**
   * Met à jour une entrée
   */
  static async findByIdAndUpdate(id, updates) {
    const updateData = {
      status: updates.status,
      article_id: updates.articleId,
      error: updates.error,
      retry_count: updates.retryCount,
      processed_at: updates.processedAt,
    };

    // Supprimer les undefined
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const { data, error } = await supabase
      .from('url_queue')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.formatQueueItem(data);
  }

  /**
   * Supprime une entrée
   */
  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from('url_queue')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.formatQueueItem(data);
  }

  /**
   * Sauvegarde (pour compatibilité avec Mongoose)
   */
  async save() {
    if (this.id) {
      // Update
      const updates = {
        status: this.status,
        article_id: this.articleId,
        error: this.error,
        retry_count: this.retryCount,
        processed_at: this.processedAt,
      };

      const { data, error } = await supabase
        .from('url_queue')
        .update(updates)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, UrlQueue.formatQueueItem(data));
    } else {
      // Create
      const result = await UrlQueue.create(this);
      Object.assign(this, result);
    }
    return this;
  }

  /**
   * Formate un item de queue Supabase en format MongoDB-like
   */
  static formatQueueItem(item) {
    if (!item) return null;

    const formatted = {
      _id: item.id,
      id: item.id,
      url: item.url,
      status: item.status,
      addedBy: item.added_by,
      articleId: item.articles || item.article_id,
      error: item.error,
      retryCount: item.retry_count,
      processedAt: item.processed_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };

    // Méthode save pour compatibilité
    formatted.save = async function() {
      return await UrlQueue.prototype.save.call(this);
    };

    return formatted;
  }
}

module.exports = UrlQueue;
