from pathlib import Path

JOB_INTERVAL_SECONDS = 15 * 60
EXPIRED_SESSION_TIME = 15 * 60

STATIC_DIR = Path('public/')
DOWNLOAD_DIR_PATH = Path(STATIC_DIR, 'downloads/')

IO_CLIENT_PSD = 'psd'
IO_CLIENT_STATE = 'state'
IO_CLIENT_PSD_DATA = 'psd_data'
IO_CLIENT_PSD_FONTS = 'psd_fonts'
IO_CLIENT_PSD_TEMPLATE = 'psd_template'
IO_CLIENT_PSD_FILE_PATH = 'psd_file_path'
IO_CLIENT_CONNECTION_START_TIME = 'start_time'
