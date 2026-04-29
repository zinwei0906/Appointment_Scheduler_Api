-- Appointment Scheduler Database Schema
-- Run this SQL script to create the database tables

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time VARCHAR(5) NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    slots_booked INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create days_off table
CREATE TABLE IF NOT EXISTS days_off (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unavailable_hours table
CREATE TABLE IF NOT EXISTS unavailable_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL,
    start_time VARCHAR(5) NOT NULL,
    end_time VARCHAR(5) NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(time);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date, time);
CREATE INDEX IF NOT EXISTS idx_days_off_date ON days_off(date);
CREATE INDEX IF NOT EXISTS idx_unavailable_hours_day ON unavailable_hours(day_of_week);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    key_value VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create api_response_codes table
CREATE TABLE IF NOT EXISTS api_response_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    message_en TEXT,
    message_ms TEXT,
    message_zh TEXT,
    remark TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create api_logs table
CREATE TABLE IF NOT EXISTS api_logs (
    id SERIAL PRIMARY KEY,
    api_key VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    url TEXT NOT NULL,
    request_headers TEXT,
    request_body TEXT,
    request_query TEXT,
    status_code INTEGER NOT NULL,
    response_body TEXT,
    response_time INTEGER,
    ip_address VARCHAR(50),
    user_agent TEXT,
    language VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for api tables
CREATE INDEX IF NOT EXISTS idx_api_keys_key_value ON api_keys(key_value);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_response_codes_code ON api_response_codes(code);
CREATE INDEX IF NOT EXISTS idx_api_logs_api_key ON api_logs(api_key);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_logs_status_code ON api_logs(status_code);

-- Insert default API response codes
INSERT INTO api_response_codes (code, message_en, message_ms, message_zh, remark) VALUES
('SUCCESS', 'Operation completed successfully', 'Operasi berjaya', '操作成功', 'Generic success message'),
('APPOINTMENT_CREATED', 'Appointment created successfully', 'Temujanji berjaya dibuat', '预约创建成功', 'Appointment creation success'),
('APPOINTMENT_CANCELLED', 'Appointment cancelled successfully', 'Temujanji berjaya dibatalkan', '预约取消成功', 'Appointment cancellation success'),
('APPOINTMENT_NOT_FOUND', 'Appointment not found', 'Temujanji tidak dijumpai', '未找到预约', 'Appointment does not exist'),
('SLOT_NOT_AVAILABLE', 'No available slots at the selected time', 'Tiada slot tersedia pada masa yang dipilih', '所选时间没有可用时段', 'Booking conflict'),
('INVALID_DATE', 'Selected date is not an operational day', 'Tarikh yang dipilih bukan hari operasi', '所选日期不是营业日', 'Date validation error'),
('INVALID_TIME', 'Selected time is outside operational hours', 'Masa yang dipilih di luar waktu operasi', '所选时间不在营业时间内', 'Time validation error'),
('INVALID_API_KEY', 'Invalid or missing API key', 'Kunci API tidak sah atau hilang', 'API密钥无效或缺失', 'Authentication failure'),
('API_KEY_EXPIRED', 'API key has expired', 'Kunci API telah tamat tempoh', 'API密钥已过期', 'Expired key'),
('DAY_OFF_CREATED', 'Day off created successfully', 'Hari cuti berjaya dibuat', '休息日创建成功', 'Day off creation success'),
('DAY_OFF_DELETED', 'Day off deleted successfully', 'Hari cuti berjaya dipadam', '休息日删除成功', 'Day off deletion success'),
('UNAVAILABLE_HOUR_CREATED', 'Unavailable hour created successfully', 'Waktu tidak tersedia berjaya dibuat', '不可用时间创建成功', 'Unavailable hour creation success'),
('UNAVAILABLE_HOUR_DELETED', 'Unavailable hour deleted successfully', 'Waktu tidak tersedia berjaya dipadam', '不可用时间删除成功', 'Unavailable hour deletion success'),
('VALIDATION_ERROR', 'Validation failed', 'Pengesahan gagal', '验证失败', 'Input validation error'),
('INTERNAL_ERROR', 'Internal server error', 'Ralat pelayan dalaman', '内部服务器错误', 'Server error'),
('RESOURCE_NOT_FOUND', 'Resource not found', 'Sumber tidak dijumpai', '资源未找到', 'Generic not found error')
ON CONFLICT (code) DO NOTHING;

-- Insert a default API key for testing
INSERT INTO api_keys (key_value, name, description, created_by) VALUES
('test-api-key-12345', 'Test API Key', 'Default API key for development and testing', 'system')
ON CONFLICT (key_value) DO NOTHING;