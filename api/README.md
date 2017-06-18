# API Server

## Database

- users(id / uid / provider / name / sex? / birthday? / created_at / updated_at)
- labels(id / user_id / name / priority / created_at / updated_at)
- tasks(id / user_id / label_id / content / priority / completed / created_at / updated_at)
- requests(id / user_id / label_id / status / created_at / updated_at)

## End Points

- `/api`
  - `/v1`
    - `/users`
      - `/?shared=true` GET: fetch shaed user
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
