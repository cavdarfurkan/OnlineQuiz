class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll() {}

  async findById(id) {}
  
  async create(data) {}

  async update(id, data) {}

  async delete(id) {}
}
