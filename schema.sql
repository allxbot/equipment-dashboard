DROP TABLE IF EXISTS matrix;
DROP TABLE IF EXISTS mil;
DROP TABLE IF EXISTS todo;

-- Line Progress Matrix
CREATE TABLE matrix (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site TEXT,
    project TEXT,
    line TEXT,
    sub TEXT,
    status TEXT, -- green, yellow, red, gray
    progress INTEGER, -- 0 to 6
    dates TEXT, -- JSON Array string: '["Done", "Done", ...]'
    remark TEXT
);

-- Master Issue List (MIL)
CREATE TABLE mil (
    id TEXT PRIMARY KEY, -- MIL-001
    site TEXT,
    line TEXT,
    sub TEXT,
    station TEXT,
    desc TEXT,
    root TEXT,
    action TEXT,
    dri TEXT,
    cDate TEXT,
    tDate TEXT,
    status TEXT -- Open, WIP, Closed
);

-- To-Do List
CREATE TABLE todo (
    id TEXT PRIMARY KEY, -- T-01
    task TEXT,
    site TEXT,
    line TEXT,
    sub TEXT,
    station TEXT,
    detail TEXT,
    owner TEXT,
    cDate TEXT,
    tDate TEXT,
    status TEXT -- Pending, WIP, Done, Risk
);

-- 插入一些初始演示数据 (可选)
INSERT INTO matrix (site, project, line, sub, status, progress, dates, remark) VALUES 
('RiS', 'V63', 'Golden Line 1', 'Display Sub', 'yellow', 3, '["Done", "Done", "Done", "IP", "1/28", "2/05", "2/15"]', 'VGA孔区脏污方案评估');
