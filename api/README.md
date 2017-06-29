# API Server

## Database

- users(id / uid / provider / username / created_at / updated_at)
- labels(id / user_id / name / created_at / updated_at)
- label_statuses(id / user_id / label_id / priority / visibled)
- tasks(id / user_id / label_id / content / priority / completed / created_at / updated_at)
- requests(id / user_id / label_id / status / created_at / updated_at)

## End Points

- `/api`
  - `/v1`
    - `/tokens`
      - `/` POST: create token
    - `/users`
      - `/current` GET: fetch current user
      - `/current` PUT: update current user
      - `/?shared=true` GET: fetch shaed users
    - `/tasks`
      - `/` GET: fetch tasks
      - `/` PUT: update tasks
      - `/` POST: create task
      - `/:id` GET: fetch task
      - `/:id` PUT: update task
      - `/:id` DELETE: delete task
    - `/labels`
      - `/` GET: fetch labels
      - `/` PUT: update labels
      - `/` POST: create label
      - `/:id` GET: fetch label
      - `/:id` PUT: update label
      - `/:id` DELETE: delete label
    - `/requests`
      - `/` GET: fetch requests
      - `/` POST: create request
      - `/:id` PUT: update request
      - `/:id` DELETE: delete request

# Test

```
$ npm run db:create
$ NODE_ENV=test npm run db:migrate
$ NODE_ENV=test npm run dev
$ NODE_ENV=test npm test
```
