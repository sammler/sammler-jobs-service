describe('[integration] => agenda (jobs)', () => {
  describe('POST /v1/jobs', () => {
    it('creates a new job and returns values');
    it('throws an error if the user is not authenticated');
    it('updates a job for the given processor/subject/user_id');
    it('throws an error if `processor` is not provided');
    it('throws an error if `user_id` is not provided');
    it('throws an error if `tenant_id` is not provided');
    it('throws an error if `subject` is not provided');
    it('throws an error if `repeatPattern` is not provided');
  });
  describe('GET /v1/jobs', () => {
    it('returns the jobs for the currently authenticated user');
    it('returns `Unauthorized` if there is no user');
  });
  describe('DELETE /v1/jobs/:id', () => {
    it('deletes a job for the currently authenticated user');
    it('throws `Unauthorized` if there is no valid user');
  });
});
