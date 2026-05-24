import pandas as pd

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status as drf_status

from .models import EmissionRecord
from .serializers import EmissionRecordSerializer


@api_view(['POST'])
def upload_csv(request):

    file = request.FILES['file']

    source_type = request.data.get('source_type')

    df = pd.read_csv(file)

    for _, row in df.iterrows():

        value = row.get('value', 0)

        status = 'PENDING'

        if value < 0:
            status = 'FAILED'

        EmissionRecord.objects.create(
            company_name=row.get('company_name', 'Unknown'),
            source_type=source_type,
            raw_value=value,
            normalized_value=value,
            unit=row.get('unit', ''),
            status=status,
            description=row.get('description', '')
        )

    return Response({
        "message": "CSV uploaded successfully"
    })


@api_view(['GET'])
def get_records(request):

    records = EmissionRecord.objects.all()

    serializer = EmissionRecordSerializer(
        records,
        many=True
    )

    return Response(serializer.data)


# PATCH /api/records/<id>/approve/
# This view finds a single record by its ID and sets its status to APPROVED
@api_view(['PATCH'])
def approve_record(request, pk):

    # Try to find the record with the given ID (pk = primary key)
    try:
        record = EmissionRecord.objects.get(pk=pk)
    except EmissionRecord.DoesNotExist:
        # If not found, return a 404 error
        return Response(
            {"error": "Record not found"},
            status=drf_status.HTTP_404_NOT_FOUND
        )

    # Update the status field to APPROVED
    record.status = 'APPROVED'
    record.save()

    # Return the updated record as JSON
    serializer = EmissionRecordSerializer(record)
    return Response(serializer.data)
