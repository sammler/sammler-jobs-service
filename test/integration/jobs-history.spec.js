describe('[integration] => jobs-history', () => {

  describe('`POST /v1/jobs-history', () => {
    it('throws `UNAUTHORIZED` without a valid JWT-token');
    it('throws a validation error if required params are not passed');
    it('saves and returns a new job-history entry');
  });

  describe('`GET /v1/jobs-history`', () => {
    it('throws `UNAUTHORIZED` without a valid JWT-token');
    it('returns an empty array if there are no entries available');
    it('returns job-history-items');
    it('allows paging');
  });

  describe('`GET /v1/jobs-history/:job-history-id', () => {
    it('throws `UNAUTHORIZED` without a valid JWT-token');
    it('allows to delete a job-history item');
  });

  describe('`DELETE /v1/jobs-history`', () => {
    it('throws `UNAUTHORIZED` without a valid JWT-token');
    it('deletes all items of a given user, does not touch other items');
  });

  describe('`DELETE /v1/jobs-history/:job-history-id`', () => {
    it('throws `UNAUTHORIZED` without a valid JWT-token');
    it('deletes a given job-history item');
  });

  describe('`DELETE /v1/jobs-history/all?by=tenant', () => {
    it('throws `UNAUTHORIZED` without a valid JWT-token');
    it('throws `UNAUTHORIZED` without owning the role `tenant-admin`');
    it('deletes all items within a tenant and does not touch others');
  });

  describe('`DELETE /v1/jobs-history/all?by-system', () => {
    it('throws `UNAUTHORIZED` without a valid JWT-token');
    it('throws `UNAUTHORIZED` without owning the role `system`');
    it('deletes all records');
  });
});
