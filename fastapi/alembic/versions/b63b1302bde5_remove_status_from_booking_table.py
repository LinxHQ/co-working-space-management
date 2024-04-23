"""remove status from booking table

Revision ID: b63b1302bde5
Revises: c3aef4bf2256
Create Date: 2024-04-16 13:17:14.272979

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'b63b1302bde5'
down_revision = 'c3aef4bf2256'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bookings', 'status')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bookings', sa.Column('status', mysql.ENUM('upcoming', 'past', 'cancelled', 'modified'), nullable=True))
    # ### end Alembic commands ###